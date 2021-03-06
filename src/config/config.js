/* eslint no-process-env: "off" */

/**
 * JSON object representing the service's configuration.
 * Environment configuration should be handled via environment variables.
 */
export const config = {
  server: {
    port: process.env.SERVER_PORT || '3000',
    address: process.env.SERVER_ADDRESS || 'localhost',
  },
  client: {
    hapiBabelBaseline: {
      url: process.env.HAPI_BABEL_URL || 'http://localhost:3000',
      getTimeout: 3000,
    }
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
        case 'test-integration':
        case 'test-unit':
          keyFolder = 'test';
          keyFileName = 'fake_public_key.pem';
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
  },
  tests: {
    integration: {
      runInDocker: process.env.INT_TEST_RUN_IN_DOCKER === 'false' ? false : true
    }
  }
};
