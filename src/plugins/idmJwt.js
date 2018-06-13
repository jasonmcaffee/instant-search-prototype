/* eslint no-nested-ternary: "off" */

import * as logger from 'logger';
import {config} from '../config/config';
import * as hapiJWT from 'hapi-auth-jwt2';
import fs from 'fs';

/**
 * Plugin for logging details for every request that comes through the server.
 * http://hapijs.com/tutorials/plugins
 */
export default {
  name: 'idmJwt',
  version: '1.0.0',
  async register(server, options){
    const idmPublicKey = fs.readFileSync(config.jwt.idmPublicKeyRelativePath);
    // let serverRegisterPromisified = bluebird.promisify(server.register.bind(server));
    // await serverRegisterPromisified(hapiJWT);
    await server.register(hapiJWT);
    server.auth.strategy('jwt', 'jwt', {
      key: idmPublicKey,
      async validate(decoded, request){
        // add the token user to the request so handlers have access to it. e.g. to check capabilities.
        const isValid = isNaN(decoded.id);
        request.jwt = {tokenUser: decoded};
        return {isValid};
      }, // as long as they have the token they are valid.
      verifyOptions: {algorithms: ['RS256']}
    });
  }
};