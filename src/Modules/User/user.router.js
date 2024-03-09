import { Router } from "express";
import * as UC from './user.controller.js'
import expressAsyncHandler from "express-async-handler";
import auth from "../../Middlewares/auth.js";
import { allowRole } from "../../utils/systemRule.js";
import vld from "../../Middlewares/validation.js";
import * as schema from './user.validator.js'

const router = Router();

router
//!  1--------------------------------> SignUp <-------------
.post('/signUp',vld(schema.signUp),expressAsyncHandler(UC.signUp))
//!  2--------------------------------> SignIn <-------------
.post('/signIn',vld(schema.signIn),expressAsyncHandler(UC.signIn))
//!  3--------------------------------> update account date  <-------------
.put('/',vld(schema.updateSchema),auth([allowRole.USER,allowRole.COMPANY_HR]),expressAsyncHandler(UC.updateAccount))
//!  4--------------------------------> Delete account  <-------------
.delete('/',vld(schema.headersOnly),auth([allowRole.USER,allowRole.COMPANY_HR]),expressAsyncHandler(UC.deleteAccount))
//!  9--------------------------------> get All recoveryEmail  <-------------
.get('/recoveryEmail/',vld(schema.recovery),expressAsyncHandler(UC.recovery))
//!  5--------------------------------> get Account Data  <-------------
.get('/',vld(schema.headersOnly),auth([allowRole.USER,allowRole.COMPANY_HR]),expressAsyncHandler(UC.getAccount))
//!  6--------------------------------> Get profile data for another user   <-------------
.get('/:id',vld(schema.featchAnotherUser),auth([allowRole.USER,allowRole.COMPANY_HR]),expressAsyncHandler(UC.getUserProfile))
//!  7--------------------------------> Update password   <-------------
.patch('/',vld(schema.changePass),auth([allowRole.USER,allowRole.COMPANY_HR]),expressAsyncHandler(UC.changePass))
//!  8--------------------------------> Forget password   <-------------
.patch('/forgetPassword/',vld(schema.forgetPassword),expressAsyncHandler(UC.forgetPass))
//!  --------------------------------> get Code For reset Password <-------------
.post('/code',vld(schema.getCode),expressAsyncHandler(UC.getCode))
export default router