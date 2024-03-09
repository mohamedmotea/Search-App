import Joi from "joi";
import validate from './../../utils/globalValidator.js';

export const addJob = {
  body:Joi.object({
    jobTitle:Joi.string().required(),
    jobLocation:Joi.string().required().valid('onsite','remotely','hybrid'),
    workingTime:Joi.string().required().valid('part-time','full-time'),
    seniorityLevel:Joi.string().required().valid('Junior','Mid-Level','Senior','Team-Lead','CTO'),
    jobDescription:Joi.string(),
    technicalSkills:Joi.array().required(),
    softSkills:Joi.array().required()
  }),
  headers: Joi.object(validate.headers)
}

export const updateJob = {
  body:Joi.object({
    jobTitle:Joi.string(),
    jobLocation:Joi.string().valid('onsite','remotely','hybrid'),
    workingTime:Joi.string().valid('part-time','full-time'),
    seniorityLevel:Joi.string(),
    jobDescription:Joi.string(),
    technicalSkills:Joi.array(),
    softSkills:Joi.array()
  }),
  headers: Joi.object(validate.headers),
  params:Joi.object({
    jobId:validate.objId
  })
}
export const deleteJob = {
  headers: Joi.object(validate.headers),
  params:Joi.object({
    jobId:validate.objId
  })
}

export const JobsSpecificCompany = {
  query:Joi.object({
    companyName:Joi.string().required()
  }),
  headers: Joi.object(validate.headers)
}

export const filterJobs = {
  query:Joi.object({
    jobTitle:Joi.string(),
    jobLocation:Joi.string().valid('onsite','remotely','hybrid'),
    workingTime:Joi.string().valid('part-time','full-time'),
    seniorityLevel:Joi.string(),
    technicalSkills:Joi.array()
  }),
  headers: Joi.object(validate.headers)
}

export const applyJob = {
  body:Joi.object({
    userTechSkills:Joi.string().required(),
    userSoftSkills:Joi.string().required()
  }),
  headers: Joi.object(validate.headers),
  params:Joi.object({
    jobId:validate.objId
  })
}