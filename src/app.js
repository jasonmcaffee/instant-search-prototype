/* eslint no-process-env: "off" */
/* eslint no-sync: "off" */
/* eslint global-require: "off" */
// allow imports/requires to use non-relative paths to load other modules.
// e.g. instead of require('../../services/health') we can use require('services/health')
process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();
console.log('NODE_PATH is ' + process.env.NODE_PATH);

import Promise from 'bluebird';
import Hapi from 'hapi';
import Inert from 'inert';
import Vision from 'vision';
import HapiSwaggered from 'hapi-swaggered';
import HapiSwaggeredUI from 'hapi-swaggered-ui';
import Pack from '../package';
const glob = Promise.promisify(require('glob'));
import * as Boom from 'boom';
import Joi from 'joi';
import fs from 'fs';
import * as hapiJWT from 'hapi-auth-jwt2';
import * as bluebird from 'bluebird';
import {config, configSchema} from './config/config';
import * as logger from 'logger';


/**
 * Starts the hapi server, registering all routes found in the /lib/routes folder.
 */
async function startServer () {
  try {
    // Create a server with a host and port
    const server = new Hapi.Server();
    await validateConfig(config);
    server.connection({port: config.server.port});
    await configureJwt(server);
    await registerPlugins(server);
    await loadAndRegisterRouteModules(server);

    logger.log(`starting mapping service with configuration: ${JSON.stringify(config, null, 2)}`);

    await server.start();

    logger.log('Server running at:', server.info.uri);
  } catch (err) {
    logger.error(`error: ${err.stack}`);
  }
}

/**
 * Creates a node cluster so that each cpu core can be used.
 */
function startServerCluster () {
  const cluster = require('cluster');
  const numCPUs = 1; // require('os').cpus().length;
  logger.info(`creating a server cluster for ${numCPUs} cpus`);
  if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.log(`worker ${worker.process.pid} died`);
    });
  } else {
    startServer();
  }
}

/**
 * Users must be authenticated in order to use our endpoing.
 * This uses the IDM public key to decode the jwt token.
 * If the token is invalid or expired, an unauthorized exception is thrown.
 * @param server
 */
async function configureJwt (server) {
  let idmPublicKey = fs.readFileSync(config.jwt.idmPublicKeyRelativePath);
  let serverRegisterPromisified = bluebird.promisify(server.register.bind(server));
  await serverRegisterPromisified(hapiJWT);

  server.auth.strategy('jwt', 'jwt', {
    key: idmPublicKey,
    validateFunc: (decoded, request, callback)=>{
      // add the token user to the request so handlers have access to it. e.g. to check capabilities.
      request.jwt = {tokenUser: decoded};
      callback(null, true);
    }, // as long as they have the token they are valid.
    verifyOptions: {algorithms: ['RS256']}
  });
  // server.auth.default('jwt');
}

/**
 * Validates that appropriate environment variables were passed in. (
 * @param configuration - config object typically found in config/config
 */
async function validateConfig (configuration) {
  let joiValidatePromisified = bluebird.promisify(Joi.validate);
  try {
    await joiValidatePromisified(configuration, configSchema);
  } catch (e) {
    logger.error(`Server config is not valid: ${e.message}`);
  }
}

/**
 * Registers all needed hapi plugins (Swagger, Vision, etc)
 * @param server - hapi server instance which will have plugins registered
 */
async function registerPlugins (server) {
  let pluginModules = await loadProjectPluginModules();
  let serverRegisterPromisified = bluebird.promisify(server.register.bind(server));
  return serverRegisterPromisified([
    Inert, // Static file and directory handlers plugin for hapi.js.
    Vision, // Templates rendering plugin support for hapi.js.
    {
      register: HapiSwaggered,
      options: {
        tags: {
          api: 'description'
        },
        info: {
          title: Pack.name,
          description: Pack.description,
          version: Pack.version
        }
      }
    },
    {
      register: HapiSwaggeredUI,
      options: {
        title: Pack.name,
        path: '/docs',

        authorization: { // see above
          field: 'apiKey',
          scope: 'query', // header works as well
          // valuePrefix: 'bearer '// prefix incase
          defaultValue: 'demoKey',
          placeholder: 'Enter your apiKey here'
        },
        swaggerOptions: {
        } // see above
      }
    }
  ].concat(pluginModules));
}

/**
 * Loads our custom plugins (such as logRequests) from the plugin dir.
 * @returns {*|Array}
 */
async function loadProjectPluginModules () {
  let pluginFilePaths = await glob('./plugins/**/*.js', {cwd: './build'});
  let pluginModules = pluginFilePaths.map((filePath)=>{
    let pluginModule = require(filePath);//eslint-disable-line
    return pluginModule;
  });
  return pluginModules;
}

/**
 * Finds all routes in the compiled lib/routes directory and registers them with the hapi server.
 * Route modules are expected to export default { method: 'GET', path: ...}
 * Assigns auth='jwt' for all routes, unless BYPASS_USER_AUTH is 'true' (for local dev)
 */
async function loadAndRegisterRouteModules (server) {
  // find all route file paths
  let routeFilePaths = await glob('./routes/**/*.js', {cwd: './build'});
  logger.log(`route files found: ${JSON.stringify(routeFilePaths, null, 2)}`);

  // load module from each file path
  let routeModules = routeFilePaths.map((filePath)=>{
    // since we can't use import anywhere but at the top, use require, and grab the .default property (ie the module)
    let routeModule = require(filePath); // eslint-disable-line

    // disable auth if env variable is passed in (for development purposes only)
    if (config.server.bypassUserAuth !== 'true' && routeModule.default.config.auth !== false) {
      routeModule.default.config.auth = 'jwt'; // by default all routes will use jwt authentication.
    }

    let originalHandler = routeModule.default.config.handler;
    routeModule.default.config.handler = handlerWrapper(originalHandler);
    return routeModule.default;
  });

  server.route(routeModules);
}

/**
 * Wrap all handlers with this function so we don't have to do a try catch block in every handler.
 * @param originalHandler
 * @returns {function(*=, *=)}
 */
function handlerWrapper (originalHandler) {
  return async (req, reply)=>{
    try {
      let result = await originalHandler(req, reply);
      return result;
    } catch (e) {
      let error = e instanceof Error ? e : new Error(e);
      logger.error(`Error was encountered: ${e.stack}`);
      return reply(Boom.wrap(error, 500, 'uncaught exception in handler function'));
    }
  };
}

// start the server
// startServer();
startServerCluster();
