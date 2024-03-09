
import moment from 'moment';
import App from '../../../DB/Models/application.model.js';
import Company from './../../../DB/Models/company.model.js';
import Job from './../../../DB/Models/job.model.js';
import excel from 'excel4node'
import { Schema } from 'mongoose';
/*
-- get data from request body
-- check if companyName or companyEmail is already used 
-- create new company 
*/
//! 1------------------------> add Company 
export const addCompany = async (req,res,next)=>{
  const {companyName,description,industry,address,companyEmail,numberOfEmployees} = req.body
  const check = await Company.findOne({$or:[{companyName},{companyEmail}]})
  if(check) return next(new Error('Company Name Or Email Is Already Exist',{cause:409}));
  const {id} = req.user
  const company = await Company.create({companyName,description,industry,address,companyEmail,numberOfEmployees,companyHR:id})
  if(!company) return next(new Error('Something went wrong',{cause:400}));
  res.status(201).json({msg:'success',company})
}

/*
-- get data from request body
--  find company && owner 
--  update company by this data
*/
//! 2------------------------> Update company data
export const updateCompany = async (req,res,next)=>{
    const {id} = req.user
    const {companyId} = req.params
    const {description,industry,address,numberOfEmployees} = req.body
    const owner = await Company.findOne({_id:companyId,companyHR:id})
    if(!owner) return next(new Error('Unauthorized',{cause:401}));
    const company = await Company.findByIdAndUpdate(companyId,{description,industry,address,numberOfEmployees},{new:true}).populate({path:'companyHR',select:'userName'})
    if(!company) return next(new Error('Something went wrong',{cause:400}));
    res.status(200).json({msg:'success',company})
}

/*
--  Identify the company from request params
--  find company && owner 
--  delete company by owner
*/
//! 3------------------------> delete company
export const deleteCompany = async (req,res,next)=>{
  const {id} = req.user
  const {companyId} = req.params
  const owner = await Company.findOne({_id:companyId,companyHR:id})
  if(!owner) return next(new Error('Unauthorized',{cause:401}));
  const company = await Company.findByIdAndDelete(companyId)
  if(!company) return next(new Error('Something went wrong',{cause:400}));
  res.status(200).json({msg:'success',company})
}

/*
-- Identify the company from request params
-- find company && owner 
-- get all jobs in this company By Hr
*/
//! 4------------------------> Get company data
export const getCompany = async (req,res,next)=>{
  const {companyId} = req.params
  const company = await Company.findById(companyId).populate([{path:'companyHR',select:'userName status'}])
  if(!company) return next(new Error('Company notfound',{cause:404}));
  const {companyHR} = company
  const jobs = await Job.find({addedBy:companyHR._id})
  res.status(200).json({msg:'success',company,jobs})
}

/*
-- get company Name from request query
-- find this company and return company & hr userName and status
*/
//! 5------------------------> Get Company By Name
export const getCompanyByName = async (req,res,next)=>{
  const {companyName} = req.query
  const company = await Company.findOne({companyName}).populate([{path:'companyHR',select:'userName status'}])
  if(!company) return next(new Error('Company notfound',{cause:404}));
  res.status(200).json({msg:'success',company})
}

/*
-- get job Id from request params
-- get this job & owner
-- All Applications for this job
*/
//! 6------------------------> Get all applications for specific Jobs and specific day by (Owener)
export const applicationJobs = async(req,res,next)=>{
  const {id} = req.user
  const {jobId} = req.params
  const job =  await Job.findOne({_id:jobId,addedBy:id})
  if(!job) return next(new Error('Unauthorized',{cause:401}));
  const applications = await App.find({jobId:jobId}).populate([{path:'userId',select:'-email -password -recoveryEmail'}])
  res.status(200).json({msg:'success',applications})
}
/*
-- id this job
-- get day 
-- check if job exists
-- change time for database schmea 
-- check if this day valid
-- get all applications for this job
-- filter application by day
-- check if job have any applications
-- new instance from excel module
-- create worksheet
-- style for excel sheet
-- loop to create headers fields
-- loop to set width fields
-- loop to write data in excel sheet
-- create file in pc
-- response application
*/
// ! -----------------------------------> Excel file for application
export const applicationExcel = async(req, res, next)=>{
  const {id} = req.user
  const {jobId} = req.params
  const {day} = req.query
  // check if job exists
  const job =  await Job.findOne({_id:jobId,addedBy:id})
  if(!job) return next(new Error('Unauthorized',{cause:401}));
  // change time for database schmea 
  const timeSchema = moment(day).format(Schema.Types.Data).split('T')[0]
  // check if this day valid
    if(timeSchema == 'Invalid date') return next(new Error('Invalid date',{cause:400}))
    // get all applications for this job
  const applications = await App.find({jobId:jobId}).populate([{path:'userId',select:'userName email DOB status'}])
  // filter application by day
  const apps = applications.filter((app) => moment(app.createdAt).format(Schema.Types.Data).split('T')[0].startsWith(timeSchema))
  // check if job have any applications
  if(!apps.length) return res.status(404).json({message:`applications in ${timeSchema} not found`})
  // new instance from excel module
  const workbook = new excel.Workbook()
  // create worksheet
  const worksheet = workbook.addWorksheet('Sheet 1');
// style for excel sheet
  let style = workbook.createStyle({
    font: {
      color: '#333457',
      size: 12,

    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
  });
  // style for header fields 
  let headStyle = workbook.createStyle({
    font: {
      color: '#000000',
      size: 18,
      bold: true,
      underline: true
    },
  
  });
  // array of header fields
  const headerSheet = ['username', 'status','email' , 'DOB' , ' Tech Skills', 'Soft Skills ', 'Resume ']
  // loop to create headers fields
    headerSheet.map((field,index)=> worksheet.cell(1,index+1).string(field).style(headStyle))
    // loop to set width fields
    headerSheet.map((field,index)=> worksheet.column(index+1).setWidth(30))
    worksheet.column(7).setWidth(150)
    worksheet.row(1).setHeight(20)
// loop to write data in excel sheet
      apps.forEach((app,index)=>{
      worksheet.cell(index+2,1).string(app.userId.userName).style(style)
      worksheet.cell(index+2,2).string(app.userId.status).style(style)
      worksheet.cell(index+2,3).string(app.userId.email).style(style)
      worksheet.cell(index+2,4).string(app.userId.DOB.toString().split('(')[0]).style(style)
      worksheet.cell(index+2,5).string(app.userTechSkills.toString().trim()).style(style)
      worksheet.cell(index+2,6).string(app.userSoftSkills.toString().trim()).style(style)
      worksheet.cell(index+2,7).string(app.userResume[0].secure_url.toString()).style(style)
    })
    // create file in pc
    workbook.write(`${timeSchema}_Excel.xlsx`)

    res.status(200).json({msg:'success',apps})
}
