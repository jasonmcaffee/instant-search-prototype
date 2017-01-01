/* eslint no-process-env: "off" */
import Joi from 'joi';
/**
 * JSON object representing the service's configuration.
 * Environment configuration should be handled via environment variables.
 */
export let config = {
  server: {
    port: process.env.SERVER_PORT || '3000',
    bypassUserAuth: process.env.BYPASS_USER_AUTH || 'false'  // only for local development
  },
  jwt: {
    baseKeyPath: process.env.BASE_KEY_PATH || './keys',
    get idmPublicKeyRelativePath () {
      let environment = process.env.NODE_ENV.toLowerCase(); // if NODE_ENV is not set, this should blow up and stop server.
      let baseRelativePathForKey = this.baseKeyPath;
      let keyFileName = 'idm_public_key.pem';
      let keyFolder;
      switch (environment) {
        case 'local':
          keyFolder = 'local';
          break;
        case 'alpha':
          keyFolder = 'alpha';
          break;
        case 'beta':
          keyFolder = 'beta';
          break;
        case 'production':
          keyFolder = 'prod';
          break;
        default:
          throw new Error(`the NODE_ENV value of: ${environment} is not "local", "alpha", "beta", or "production"`);
      }
      let keyPath = `${baseRelativePathForKey}/${keyFolder}/${keyFileName}`;
      return keyPath;
    }
  }
};

export let configSchema = Joi.object().required()
    .keys({
      server: Joi.object().required().keys({
        port: Joi.string().required(),
        bypassUserAuth: Joi.string().required()
      }),
      jwt: Joi.object().required().keys({
        baseKeyPath: Joi.string().required(),
        idmPublicKeyRelativePath: Joi.string().required()
      })
    });
