/* eslint no-nested-ternary: "off" */

import * as logger from 'logger';

/**
 * Plugin for logging details for every request that comes through the server.
 * http://hapijs.com/tutorials/plugins
 */
export default {
  name: 'logRequests',
  version: '1.0.0',
  async register(server, options){

    // listen to all requests
    server.ext('onRequest', function (request, reply) {
      // keep track of this request's start time, so we can evaluate it once reply is called by the handler.
      request.plugins.startTime = Date.now();
      return reply.continue;
    });

    // listen to all responses
    server.events.on('response', async (request)=> {
      const endTime = Date.now();
      const duration = endTime - request.plugins.startTime;
      const {authorization, ...headersWithTokenOmmitted} = request.headers; //eslint-disable-line
      let idmGuid = -1;
      let orgId = -1;
      if(request.jwt && request.jwt.tokenUser){
        idmGuid = request.jwt.tokenUser.idmGuid;
        orgId = request.jwt.tokenUser.orgid;
      }
      const requestData = {
        level: "info",
        timeISOString: new Date().toISOString(),
        idmGuid,
        orgId,
        requestId: request.id,
        headers: headersWithTokenOmmitted,
        method: request.method.toUpperCase(),
        url: request.url.href,
        statusCode: request.response.statusCode,
        responseTimeMilli: duration,
        remoteAddress: request.info.remoteAddress,
        responseBytes: request.response._payload ? typeof request.response._payload.size === 'function' ? request.response._payload.size() : 0 : 0
      };

      logInISKitFormat(requestData);
    });
  }
};

function logInISKitFormat({timeISOString, idmGuid, orgId, requestId, headers, method, url, statusCode, responseTimeMilli, responseBytes, level, file="logRequests.js", service="roles-and-permissions"}){
  logger.log(`time=${timeISOString} level=${level} duration=${responseTimeMilli}ms file=${file} idmGUID=${idmGuid} method=${method} orgID=${orgId} response_size=${responseBytes} service=${service} status=${statusCode} url=${url}`);
}