import { Schema, model } from "mongoose";


const job_schema = new Schema({
  jobTitle:{
    type:String,
    required:true
  },
  jobLocation:{
    type:String,
    required:true,
    enum:['onsite','remotely','hybrid'],
    default:'onsite'
  },
  workingTime:{
    type:String,
    required:true,
    enum:['part-time','full-time'],
    default:'full-time'
  },
  jobDescription:{
    type:String,
  },
  seniorityLevel:{
    type:String,
    required:true,
    enum:['Junior','Mid-Level','Senior','Team-Lead','CTO'],
    default:'Junior'
  }
  ,
  technicalSkills:{
    type:Array,
    required:true
  },
  softSkills:{
    type:Array,
    required:true
  },
  addedBy:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true,
  }

},{timestamps:true});

const Job = model('Job',job_schema)

export default Job