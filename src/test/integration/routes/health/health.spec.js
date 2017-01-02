import * as hapiBabelBaselineClient from 'client/hapiBabelBaseline';
import Joi from 'joi';
import * as bluebird from 'bluebird';
import {healthResponse as healthResponseSchema} from 'schemas/health/health';

let validatePromisified = bluebird.promisify(Joi.validate.bind(Joi));

describe("health route", ()=>{

  it("should return health data", async (done)=>{
    let clientResult = await hapiBabelBaselineClient.getHealthData('faketoken');
    let validateResult = await validatePromisified(clientResult, healthResponseSchema);
    done();
  });

});