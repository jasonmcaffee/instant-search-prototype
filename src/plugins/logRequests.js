/* eslint no-nested-ternary: "off" */

import * as logger from 'logger';

/**
 * Plugin for logging details for every request that comes through the server.
 * http://hapijs.com/tutorials/plugins
 */
let logRequestsPlugin = {
  register: (server, options, next) => {

    // listen to all requests
    server.ext('onRequest', function (request, reply) {
      // keep track of this request's start time, so we can evaluate it once reply is called by the handler.
      request.plugins.startTime = Date.now();
      return reply.continue();
    });

    // listen to all responses
    server.on('response', (request)=> {
      // calculate how long it took from request to response.
      let endTime = Date.now();
      let duration = endTime - request.plugins.startTime;
      let {authorization, ...headersWithTokenOmmitted} = request.headers; //eslint-disable-line
      let requestData = {
        requestId: request.id,
        headers: headersWithTokenOmmitted,
        method: request.method.toUpperCase(),
        url: request.url.href,
        statusCode: request.response.statusCode,
        responseTimeMilli: duration,
        remoteAddress: request.info.remoteAddress,
        responseBytes: request.response._payload ? typeof request.response._payload.size === 'function' ? request.response._payload.size() : 0 : 0
      };

      // grok_pattern: %{WORD:request_verb} %{URIPATHPARAM:request_path} %{INT:response_status} (%{INT:response_bytes}|-) - %{BASE10NUM:response_time;float} ms -
      // %{IPV4MAPPEDIPV6:remote_addr}
      let graylogExtractorFormattedRequestData = `${requestData.method} ${requestData.url} ${requestData.statusCode} ${requestData.responseBytes} - ${requestData.responseTimeMilli} ms - ::ffff:${requestData.remoteAddress} - ${JSON.stringify(requestData.headers)}`; //eslint-disable-line
      logger.log(graylogExtractorFormattedRequestData);
    });

    next();
  }
};

logRequestsPlugin.register.attributes = {
  name: 'logRequests',
  version: '1.0.0'
};

export let register = logRequestsPlugin.register;
