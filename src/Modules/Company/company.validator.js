import Joi from "joi";
import validate from "../../utils/globalValidator.js";


export const addCompany = {
  body:Joi.object({
    companyName:Joi.string().min(3).max(100).trim(),
    description:Joi.string().min(3).max(1000).trim(),
    industry:Joi.string().min(3).max(100).trim(),
    address:Joi.string().min(3).max(1000).trim(),
    companyEmail:Joi.string().trim(),
    numberOfEmployees:Joi.number().min(11).max(20)
  }).required()
  ,headers:Joi.object(validate.headers)
}

export const updateCompany = {
  body:Joi.object({
    description:Joi.string().min(3).max(1000).trim(),
    industry:Joi.string().min(3).max(100).trim(),
    address:Joi.string().min(3).max(1000).trim(),
    numberOfEmployees:Joi.number().min(11).max(20)
  })
,headers:Joi.object(validate.headers),
  params:Joi.object({
    companyId:validate.objId
  }).required()
}
export const deleteCompany = {
  headers:Joi.object(validate.headers),
  params:Joi.object({
    companyId:validate.objId
  }).required()
}

export const getCompany = {
  headers:Joi.object(validate.headers),
  params:Joi.object({
    companyId:validate.objId.required()
  })
}
export const getCompanyByName = {
  headers:Joi.object(validate.headers),
  query:Joi.object({
    companyName:Joi.string().min(3).max(100).trim().required()
  })
}

export const applicationExcel = {
  headers:Joi.object(validate.headers),
  params:Joi.object({
    jobId:validate.objId.required()
  }),
  query:Joi.object({
    day:Joi.date().required()
  })
}