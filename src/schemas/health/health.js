import Joi from 'joi';
import {configSchema} from 'schemas/config/config';

export let serverStatus = Joi.object().required()
    .keys({
      ok: Joi.boolean().required()
            .description('true if server and all subsystems are functioning, false otherwise')
            .example(true),
      config: configSchema
    })
    .meta({className: 'serverStatus'}); // so hapi swagger shows non-auto-generated model name.


export let osStatus = Joi.object().required()
    .keys({
      ok: Joi.boolean().required()
            .description('true if server and all subsystems are functioning, false otherwise')
            .example(true),

      hostname: Joi.string().required()
            .description('name of the host the service is running on')
            .example('Jasons-Macbook.local'),

      type: Joi.string().required()
            .description('type of os')
            .example('Darwin'),

      platform: Joi.string().required()
            .description('name of the os platform')
            .example('darwin'),

      arch: Joi.string().required()
            .description('cpu architecture')
            .example('x64'),

      release: Joi.string().required()
            .description('os release version')
            .example('15.6.0'),

      uptime: Joi.number().required()
            .description('how long the system has been running for')
            .example(349174),

      loadavg: Joi.array().required()
            .description('load times for the system')
            .example([
              1.6650390625,
              1.92578125,
              1.88427734375
            ]),

      totalmem: Joi.number().required()
            .description('total memory available to the os')
            .example(17179869184),

      freemem: Joi.number().required()
            .description('free memory available to the os')
            .example(944484352),

      cpus: Joi.array().required()
            .description('cpu info')
            .example([
              {
                model: 'Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz',
                speed: 2200,
                times: {
                  user: 6358970,
                  nice: 0,
                  sys: 7772390,
                  idle: 72638900,
                  irq: 0
                }
              }
            ]),

      networkInterfaces: Joi.object().required()
            .description('network interfaces available to the os')
            .example({
              lo0: [
                {
                  address: '::1',
                  netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
                  family: 'IPv6',
                  mac: '00:00:00:00:00:00',
                  scopeid: 0,
                  internal: true
                }
              ]
            }),


    })
  .meta({className: 'osStatus'}); // so hapi swagger shows non-auto-generated model name.

export let systemOverallStatus = Joi.object()
    .keys({
      ok: Joi.boolean().required()
            .description('true if server and all subsystems are functioning, false otherwise')
            .example(true)
    })
  .meta({className: 'systemOverallStatus'}); // so hapi swagger shows non-auto-generated model name.

export let healthResponse = Joi.object().required()
    .keys({
      serverStatus,
      systemOverallStatus,
      osStatus
    })
    .meta({className: 'healthResponse'}); // so hapi swagger shows non-auto-generated model name.
