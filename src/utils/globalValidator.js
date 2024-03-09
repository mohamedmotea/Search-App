import Joi from "joi"
import { Types } from "mongoose"

const objType = (value,helper)=>{
  const isValid = Types.ObjectId.isValid(value)
  return (isValid ? value : helper.message('ObjectId is not a valid')) 
}

 const validate = {
  headers:{
    accesstoken:Joi.string().required(),
    "content-type":Joi.string(),
    "user-agent":Joi.string(),
    "accept":Joi.string(),
    "postman-token":Joi.string(),
    "host":Joi.string(),
    "accept-encoding":Joi.string(),
    "connection":Joi.string(),
    "content-length":Joi.string()
  },
  objId:Joi.string().custom(objType)
  
}
export default validate