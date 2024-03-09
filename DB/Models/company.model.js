import { Schema, model } from "mongoose";

const company_schema = new Schema({
  companyName:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    min:3,
    max:100
  },
  description:{
    type:String,
    trim:true,
    min:3,
    max:1000
  },
  industry:{
    type:String,
    trim:true,
    min:3,
    max:100
  },
  address:{
    type:String,
    trim:true,
    min:3,
    max:1000
  },
  numberOfEmployees:{
    type:Number,
    min:11,
    max:20,
    required:true
  },
  companyEmail:{
    type:String,
    required:true,
    unique:true,
    trim:true,
  },
  companyHR:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }



},{timestamps: true})

const Company = model('Company',company_schema)
export default Company