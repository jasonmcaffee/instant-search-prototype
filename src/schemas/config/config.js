import Joi from 'joi';

export let configSchema = Joi.object().required()
  .keys({
    server: Joi.object().required().keys({
      port: Joi.string().required(),
      bypassUserAuth: Joi.string().required()
    }).meta({className: 'serverConfig'}), // so hapi swagger shows non-auto-generated model name.,

    jwt: Joi.object().required().keys({
      baseKeyPath: Joi.string().required(),
      idmPublicKeyRelativePath: Joi.string().required()
    }).meta({className: 'jwtConfig'}) // so hapi swagger shows non-auto-generated model name.
  })
  .meta({className: 'configSchema'}); // so hapi swagger shows non-auto-generated model name.