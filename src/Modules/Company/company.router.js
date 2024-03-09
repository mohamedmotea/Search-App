import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as CC from './company.controller.js'
import auth from './../../Middlewares/auth.js';
import { allowRole } from './../../utils/systemRule.js';
import vld from './../../Middlewares/validation.js';
import * as schema from './company.validator.js'
const router = Router()

router
//!  1--------------------------------> add Company <-------------
.post('/',vld(schema.addCompany),auth([allowRole.COMPANY_HR]),expressAsyncHandler(CC.addCompany))
//!  2--------------------------------> Update company data <-------------
.put('/:companyId',vld(schema.updateCompany),auth([allowRole.COMPANY_HR]),expressAsyncHandler(CC.updateCompany))
//!  3--------------------------------> 3. Delete company data
.delete('/:companyId',vld(schema.deleteCompany),auth([allowRole.COMPANY_HR]),expressAsyncHandler(CC.deleteCompany))
//!  4--------------------------------> Get company data <-------------
.get('/:companyId',vld(schema.getCompany),expressAsyncHandler(CC.getCompany))
//!  5--------------------------------> Search for a company with a name <-------------
.get('/',vld(schema.getCompanyByName),auth([allowRole.COMPANY_HR,allowRole.USER]),expressAsyncHandler(CC.getCompanyByName))

//!  6--------------------------------> Get all applications for specific Jobs <-------------

.get('/apps/:jobId',auth([allowRole.COMPANY_HR]),expressAsyncHandler(CC.applicationJobs))



.get ('/excel/:jobId',vld(schema.applicationExcel),auth([allowRole.COMPANY_HR]),expressAsyncHandler(CC.applicationExcel))
export default router