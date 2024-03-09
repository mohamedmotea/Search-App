import Joi from "joi";
import validate from "../../utils/globalValidator.js";

export const signUp = {
  body:Joi.object({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    email:Joi.string().required().email(),
    password:Joi.string().required(),
    recoveryEmail:Joi.string().required().email(),
    DOB:Joi.date().required(),
    mobileNumber:Joi.string().required().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).length(11),
    role:Joi.string().valid('User','Company_HR')
  })
}

export const signIn = {
  body:Joi.object({
    email:Joi.string().email(),
    mobileNumber:Joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).length(11),
    password:Joi.string().required()
  })
}

export const updateSchema = {
  body:Joi.object({
    email:Joi.string().email(),
    mobileNumber:Joi.string().regex(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/).length(11),
    recoveryEmail:Joi.string().email(),
    DOB:Joi.date(),
    lastName:Joi.string(),
    firstName:Joi.string()
  }),
  headers:Joi.object(validate.headers)
}

export const headersOnly = {
  headers:Joi.object(validate.headers)
}
export const featchAnotherUser = {
  headers:Joi.object(validate.headers).required(),
  params:Joi.object({
    id:validate.objId
  }).required()
}
export const changePass = {
  headers:Joi.object(validate.headers),
  body:Joi.object({
    newPassword:Joi.string().required()
  })
}
export const getCode = {
  body:Joi.object({
    email:Joi.string().required().email()
  })
}
export const forgetPassword = {
  body:Joi.object({
    email:Joi.string().required().email(),
    code:Joi.string().required().length(6),
    newPassword:Joi.string().required()
  })
}
export const recovery = {
  body:Joi.object({
    recoveryEmail:Joi.string().required().email()
  })
}

