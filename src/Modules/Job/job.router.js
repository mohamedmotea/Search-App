import { Router } from "express";
import auth from './../../Middlewares/auth.js';
import * as JC from './job.controller.js';
import { allowRole } from './../../utils/systemRule.js';
import expressAsyncHandler from "express-async-handler";
import vld from './../../Middlewares/validation.js';
import * as schema from './job.validator.js'
import multerMiddleware from './../../Middlewares/multer.js';

const router = Router()

router
//! add Job 
.post('/',vld(schema.addJob),auth([allowRole.COMPANY_HR]),expressAsyncHandler(JC.addJob))
//! update Job 
.put('/:jobId',vld(schema.updateJob),auth([allowRole.COMPANY_HR]),expressAsyncHandler(JC.updateJob))
// ! delete Job
.delete('/:jobId',vld(schema.deleteJob),auth([allowRole.COMPANY_HR]),expressAsyncHandler(JC.deleteJob))
// ! get all company jobs
.get('/',vld(schema.JobsSpecificCompany),auth([allowRole.COMPANY_HR,allowRole.USER]),expressAsyncHandler(JC.JobsSpecificCompany))
// ! filter jobs
.get('/filter',vld(schema.filterJobs),auth([allowRole.COMPANY_HR,allowRole.USER]),expressAsyncHandler(JC.filterJobs))
// ! applay this job
.post('/apply/:jobId',multerMiddleware().single('resume'),vld(schema.applyJob),auth([allowRole.USER]),expressAsyncHandler(JC.applyJob))
export default router