import * as Boom from 'boom';
import {search} from 'services/search';
export default {
  method: 'GET',
  path: '/v1/search',
  config: {
    auth: false,
    description: 'short description',
    notes: 'extended notes',
    tags: ['api'],
    validate: {
      // payload: someRequestBodyPayloadSchema,
      // params: {
      //     namespace: e.g if your url was '/v1/health/{namespace}/{key}' this would validate the namespace value,
      //     key: keyJoiSchema
      // }
    },
    response: {
      //schema: someSchemaTheResponseAdheresTo
    },
    handler: async (request, reply) => {
      const query = request.query.q;
      console.log('query: ', query);
      let result = await search({query});
      return result;
    }
  }
};
