
import Job from './../../../DB/Models/job.model.js';
import Company from './../../../DB/Models/company.model.js';
import App from '../../../DB/Models/application.model.js';
import cloudinaryConnection from './../../utils/cloudinary.js';
import { uniqueFolderId } from '../../utils/generateUnique.js';

/*
-- get all data for create new job from request body
-- HR -- Owner -- added By
-- create new job 
*/
//! 1--------------------------------> Add Job   
export const addJob = async (req,res,next) => {
  const {jobTitle, jobLocation,workingTime ,seniorityLevel ,jobDescription ,technicalSkills ,softSkills } = req.body
  const {id} = req.user
  const newJob = await Job.create({jobTitle, jobLocation,workingTime ,seniorityLevel ,jobDescription ,technicalSkills ,softSkills ,addedBy:id})
  if(!newJob) return next(new Error('Job not created',{cause:400}))
  res.status(201).json({message:'Job created successfully',job:newJob})
}

/*
-- get all data for update job from request body
-- find job for update from request params
-- find job and update
*/
//! 2--------------------------------> Update Job
export const updateJob = async (req, res, next) => {
  const {jobTitle, jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills } = req.body
  const {id} = req.user
  const {jobId} = req.params
  const job = await Job.findOneAndUpdate({_id:jobId,addedBy:id},{jobTitle, jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy:id},{new:true})
  if(!job) return next(new Error('Job not updated',{cause:400}))
  res.status(201).json({message:'Job updated successfully',job})
}
/*
-- get job id from request params
-- find this job and delete by owner
*/
//! 3--------------------------------> Delete Job
export const deleteJob = async (req, res, next) => {
  const {jobId} = req.params
  const {id} = req.user
  const job = await Job.findOneAndDelete({_id:jobId,addedBy:id})
  if(!job) return next(new Error('Job not deleted',{cause:400}))
  res.status(201).json({message:'Job deleted successfully',job})
}

/*
-- get company Name from request query
-- find company by companyName
-- find all jobs in this company
*/
//! 4--------------------------------> Jobs Specific Company
export const JobsSpecificCompany = async (req, res, next) => {
  const {companyName} = req.query
  const {companyHR} = await Company.findOne({companyName})
  const jobs = await Job.find({addedBy:companyHR})
  res.status(200).json({message:'Job found successfully',jobs})
}


/*
-- filter jobs company
-- must be send any filters in request query
-- find jobs after filters
*/
//! 5--------------------------------> Filter Jobs
export const filterJobs = async (req, res, next) => {
  const {jobTitle, jobLocation,workingTime,seniorityLevel,technicalSkills } = req.query
  if(!(jobTitle || jobLocation || workingTime || seniorityLevel || technicalSkills)) return next(new Error('you should send one or more of them should applied',{cause:404}))
  const jobs = await Job.find({$or:[{jobTitle},{jobLocation},{workingTime},{seniorityLevel},{technicalSkills}]}).populate('addedBy','userName')
  res.status(200).json({message:'Job found successfully',jobs})
}

//! 6--------------------------------> Apply Job
export const applyJob = async (req, res, next) => {
  const {jobId} = req.params
  const {id} = req.user
  const {userTechSkills,userSoftSkills} = req.body
  const job = await Job.findById(jobId)
  if(!job) return next(new Error('Job not found',{cause:404}))
  const check = await App.findOne({jobId,userId:id})

if(check) return next(new Error('This user is already registered in the job',{cause:409}))
if(!req.file) return next(new Error('you should have a file to apply to your job ',{cause:404}))
const folderId = uniqueFolderId
  const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
      folder:`/searchApp/resume/${id}/${folderId}`    
    })
    const userResume = [{secure_url,public_id,folderId}]
  const apply = await (await App.create({jobId,userId:id,userTechSkills,userSoftSkills,userResume})).populate([{path:'userId',select:'userName'},{path:'jobId'}])
  if(!apply){
    await cloudinaryConnection().uploader.destroy(public_id)
    await cloudinaryConnection().api.delete_folder(`/searchApp/resume/${id}/${folderId}` )
    return next(new Error('Job not applied',{cause:404}))
  } 
  res.status(201).json({message:'Job applied successfully',apply})
}