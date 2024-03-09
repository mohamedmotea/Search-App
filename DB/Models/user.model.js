import { Schema, model } from "mongoose";


const user_schema = new Schema({
  firstName:{
    type:String,
    required:true,
    trim:true
  },
  lastName:{
    type:String,
    required:true,
    trim:true
  },
  userName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  recoveryEmail:{
    type:String,
    required:true
  },
  DOB:{
    type:Date,
    required:true,
    format: 'yyyy-MM-dd',
    min:'1960-01-01'
  
  },
  mobileNumber:{
    type:String,
    required:true,
    unique:true,
    match:/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/,
    length:11
  },
  role:{
    type:String,
    required:true,
    enum:['User','Company_HR'],
    default: 'User'
  },
  status:{
    type:String,
    enum:['online','offline'],
    default: 'offline'
  },
  code:{
    type:String,
    unique:true,
    length:6
  }
},{timestamps: true});

const User = model('User', user_schema);

export default User