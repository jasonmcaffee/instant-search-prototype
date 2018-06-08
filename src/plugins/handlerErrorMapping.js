/* eslint no-nested-ternary: "off" */

import * as logger from 'logger';
const Boom = require('boom');

/**
 * Plugin for mapping handler/controller exceptions/errors to http error status codes.
 * http://hapijs.com/tutorials/plugins
 */
export default {
  name: 'handlerErrorMapping',
  version: '1.0.0',
  async register(server, options){
    //hook for right after handler returns, and right before response goes back to client.
    server.ext('onPreResponse', function (request, h) {
      const {response} = request;
      if(!response.isBoom){return;}
      let error = response instanceof Error ? response : new Error(response);
      logger.error(`Error was encountered: ${error.stack}`);
      return Boom.boomify(error, {statusCode: 500});
    });
  }
};