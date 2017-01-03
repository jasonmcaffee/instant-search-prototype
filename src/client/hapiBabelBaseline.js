import * as rest from 'unirest';
import {config} from 'config/config';
import * as logger from 'logger';

let hapiBabelUrl = config.client.hapiBabelBaseline.url;

/**
 * HTTP GET /v1/health/data
 * Retrieves server's current health data, including config, subsystem status, os status, etc.
 * @param token
 * @returns {Promise}
 */
export const getHealthData = (token)=>{
  return new Promise((resolve, reject)=>{
    let url = hapiBabelUrl + '/v1/health/data';
    logger.log(`getting health data using url: ${url}`);
    rest.get(url)
      .timeout(config.client.hapiBabelBaseline.getTimeout)
      .header({'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
      .end(result=>{
        if (result.status !== 200 || result.error) {
          logger.error('Error response from hapi babel: \nStatus:', result.status, ' \nBody:', result.body);
          reject(result.error);
        } else {
          logger.log(`Response received from /v1/health/data: ${JSON.stringify(result.body)}`);
          resolve(result.body);
        }
      });
  });

};
