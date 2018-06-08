/**
 * Endpoint for health monitoring services, such as AWS loadbalancers, to call to ensure application is running.
 * This endpoint does not check subsystems, as AWS will restart the service if there are any issues.
 */
export default {
  method: 'GET',
  path: '/v1/healthcheck',
  config: {
    auth: false, // allow aws target group health check to access without jwt token.
    description: 'Returns 200 if app is functioning.',
    notes: `Does not check subsystems, as AWS will restart if this returns anything but 200`,
    tags: ['api'], // api tag is for hapi swagger generation
    handler: (request, h) => {
      return {};
    }
  }
};
