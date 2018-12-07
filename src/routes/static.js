import * as Boom from 'boom';

export default {
  method: 'GET',
  path: '/{param*}',
  config: {
    auth: false,
    description: 'short description',
    notes: 'extended notes',
    tags: ['api'],
    handler: {
      directory: {
        path: './web-app/build'
      }
    }
  }
};
