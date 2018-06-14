import * as logger from 'logger';
import {config} from '../config/config';
import Promise from 'bluebird';
const glob = Promise.promisify(require('glob'));
/**
 * Plugin for loading and registering all routes in the src/routes folder.
 * By default all routes require jwt authentication.  You have to explicitly set auth:false
 * When bypassUserAuth env variable is true, routes will not get auth:'jwt'
 * http://hapijs.com/tutorials/plugins
 */
export default {
  name: 'loadRoutes',
  version: '1.0.0',
  async register(server, options){
    server.dependency(['idmJwt'], ()=>{
      console.log('idmJwt dependency loaded.');
    });
    console.log('loading loadRoutes plugin');
    // find all route file paths
    const routeFilePaths = await glob('../routes/**/*.js', {cwd:'./build/plugins'});
    logger.log(`route files found: ${JSON.stringify(routeFilePaths, null, 2)}`);

    // load module from each file path
    const routeModules = routeFilePaths.map((filePath)=>{
      // since we can't use import anywhere but at the top, use require, and grab the .default property (ie the module)
      const routeModule = require(filePath); // eslint-disable-line

      // disable auth if env variable is passed in (for development purposes only)
      if (routeModule.default.config.auth !== false) {
        routeModule.default.config.auth = 'jwt'; // by default all routes will use jwt authentication.
      }
      return routeModule.default;
    });

    server.route(routeModules);
  }
};
