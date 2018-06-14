import * as hapiBabelBaselineClient from 'client/hapiBabelBaseline';
import Joi from 'joi';
import * as bluebird from 'bluebird';
import {healthResponse as healthResponseSchema} from 'schemas/health/health';

import {createTokenWithClaims} from "../../setup";

const validatePromisified = bluebird.promisify(Joi.validate.bind(Joi));

describe('health route', ()=>{

  it('should return health data', async (done)=>{
    const token = createTokenWithClaims();
    const clientResult = await hapiBabelBaselineClient.getHealthData(token);
    await validatePromisified(clientResult, healthResponseSchema);
    done();
  });

});
