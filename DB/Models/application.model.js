import { Schema, model } from "mongoose";

const app_schema = new Schema({
  jobId:{
    type:Schema.Types.ObjectId,
    ref:'Job',
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  userTechSkills:{
    type:Array,
    required:true
  },
  userSoftSkills:{
    type:Array,
    required:true
   }
   
  ,userResume:[{
    secure_url:{type:String,required:true},
    public_id:{type:String,required:true,unique:true},
    folderId:{type:String,required:true,unique:true}
  }
  ]
},{timestamps:true})

const App = model('App',app_schema)

export default App