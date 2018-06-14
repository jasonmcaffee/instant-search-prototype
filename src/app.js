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
import HapiSwagger from 'hapi-swagger';
import Pack from '../package';
const glob = Promise.promisify(require('glob'));
import Joi from 'joi';
import * as bluebird from 'bluebird';
import {config} from './config/config';
import {configSchema} from './schemas/config/config';
import * as logger from 'logger';

// strip new line chars by default. allow environment variable override.
logger.config.stripNewLineChars = !process.env.STRIP_NEWLINE_CHARS;

/**
 * Starts the hapi server, registering all routes found in the /lib/routes folder.
 */
async function startServer () {
  try {
    // Create a server with a host and port
    const server = new Hapi.server({port: config.server.port, address: config.server.address});
    await validateConfig(config);
    await registerPlugins(server);
    logger.log(`starting service with configuration: ${JSON.stringify(config, null, 2)}`);
    await server.start();
    logger.log('Server running at:', server.info.address);
  } catch (err) {
    logger.error(`error: ${err.stack}`);
  }
}

/**
 * Validates that appropriate environment variables were passed in. (
 * @param configuration - config object typically found in config/config
 */
async function validateConfig (configuration) {
  const joiValidatePromisified = bluebird.promisify(Joi.validate);
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
  const pluginModules = await loadProjectPluginModules();
  await server.register([
    Inert, // Static file and directory handlers plugin for hapi.js.
    Vision, // Templates rendering plugin support for hapi.js.
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: Pack.name,
          description: Pack.description,
          version: Pack.version
        },
        tags: [
          {
            name: 'health',
            description: 'Check health of api'
          },
        ],
        pathReplacements: [{
          replaceIn: 'groups',
          pattern: /v([0-9]+)\//,
          replacement: ''
        }]
      }
    }
  ].concat(pluginModules));
}

/**
 * Loads our custom plugins (such as logRequests) from the plugin dir.
 * @returns {*|Array}
 */
async function loadProjectPluginModules () {
  const pluginFilePaths = await glob('./plugins/**/*.js', {cwd: './build'});
  const pluginModules = pluginFilePaths.map((filePath)=>{
    let pluginModule = require(filePath);//eslint-disable-line
    return pluginModule.default;
  });
  return pluginModules;
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

// start the server
startServerCluster();
