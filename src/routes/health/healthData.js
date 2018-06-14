import {health as healthService} from 'services/health/health.js';
import {healthResponse as healthResponseSchema} from 'schemas/health/health';
export default {
  method: 'GET',
  path: '/v1/health/data',
  config: {
    description: `Returns data about the health of the service and its dependencies`,
    notes: `gets the system status data and returns as a json object, regardless of health status.`,
    tags: ['api'], // api tag is for hapi swagger generation
    validate: {
      // payload: someRequestBodyPayloadSchema,
      // params: {
      //     namespace: e.g if your url was '/v1/health/{namespace}/{key}' this would validate the namespace value,
      //     key: keyJoiSchema
      // }
    },
    response: {
      schema: healthResponseSchema
    },
    handler: async (request, h) => {
      const result = await healthService.getHealth();
      return result;
    }
  }
};
