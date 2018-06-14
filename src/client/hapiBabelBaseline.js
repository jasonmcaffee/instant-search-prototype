import {config} from 'config/config';
import * as logger from 'logger';
import fetch from 'node-fetch';
let hapiBabelUrl = config.client.hapiBabelBaseline.url;

/**
 * HTTP GET /v1/health/data
 * Retrieves server's current health data, including config, subsystem status, os status, etc.
 * @param token
 * @returns {Promise}
 */
export const getHealthData = async (token)=>{
  const url = hapiBabelUrl + '/v1/health/data';
  logger.log(`getting health data using url: ${url}`);

  const result = await fetch(url, {headers: {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}});
  const body = await result.text();

  return body;
};

