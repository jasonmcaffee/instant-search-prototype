import {service as healthService} from 'services/health/health';
import {healthResponse as healthResponseSchema} from 'schemas/health/health';
import Joi from 'joi';
import * as bluebird from 'bluebird';

const validatePromisified = bluebird.promisify(Joi.validate.bind(Joi));

describe('health service', ()=>{

  it('should provide health data which adheres to a joi schema', async ()=>{
    const result = await healthService.getHealth();
    const validateResult = await validatePromisified(result, healthResponseSchema);
    expect(validateResult).toEqual(null);
  });
});
