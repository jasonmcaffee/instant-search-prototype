import {service as healthService} from 'services/health/health';
import {healthResponse as healthResponseSchema} from 'schemas/health/health';
import Joi from 'joi';
import * as bluebird from 'bluebird';

let validatePromisified = bluebird.promisify(Joi.validate.bind(Joi));

describe('health service', ()=>{

  it('should provide health data which adheres to a joi schema', async ()=>{
    let result = await healthService.getHealth();
    let validateResult = await validatePromisified(result, healthResponseSchema);
    expect(validateResult).toEqual(null);
  });
});
