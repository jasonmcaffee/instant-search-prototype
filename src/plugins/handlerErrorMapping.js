/* eslint no-nested-ternary: "off" */

import * as logger from 'logger';
const Boom = require('boom');
import {BadRequestError, DataConflictError, DataNotFoundError, ForbiddenError} from 'errors/errors';

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
      if(!response.isBoom){return response;}
      logger.error(`Error was encountered: ${response.stack}`);
      switch (true) {
        case response instanceof DataNotFoundError:
          return Boom.notFound(response.message);
        case response instanceof DataConflictError:
          return Boom.conflict(response.message);
        case response instanceof ForbiddenError:
          return Boom.forbidden(response.message);
        case response instanceof BadRequestError:
          return Boom.badRequest(response.message);
        case response instanceof Error:
          return response;
        default:
          const error = response instanceof Error ? response : new Error(response);
          return Boom.boomify(error, {statusCode: 500});
      }
    });
  }
};