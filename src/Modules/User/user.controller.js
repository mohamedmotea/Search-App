import jwt from "jsonwebtoken"
import User from "../../../DB/Models/user.model.js"
import bcrypt from 'bcryptjs'
import { uniqueCode } from "../../utils/generateUnique.js"

/*
-- get account data from request of body 
-- collecting first name and last to get = username
-- check if Email and MobileNumber are valid to sign up or not (Unique)
-- hashed password
-- create new account
*/
//! 1--------------------- SignUp User Account
export const signUp = async (req,res,next) => {
    const {firstName, lastName,email,password,recoveryEmail,DOB,mobileNumber,role} = req.body
    // Check Email and Mobile Number
    const checkEmailAndMob = await User.findOne({$or:[{email},{mobileNumber}]})
    if(checkEmailAndMob) return next(new Error('Email or Mobile already exist',{cause:409})) 
    // get username 
    const userName =firstName + ' ' + lastName
    // Hash Password
    const hashPassword = bcrypt.hashSync(password,+process.env.SALT_ROUND)
    if(!hashPassword) return next(new Error('Something went wrong',{cause:400})) 
    // Create User
    const newUser = await User.create({firstName, lastName,userName ,email,password:hashPassword,recoveryEmail,DOB,mobileNumber,role})
    if(!newUser) return next(new Error('Something went wrong',{cause:400}))
    return res.status(201).json({message:"User created successfully"})
}

/*
-- get account data from request of body 
-- Find account By email or mobile number
-- Compare Password With Hash
-- Update User Status
-- Generate Token
*/
//! 2--------------------- SignIn User Account
export const signIn = async(req,res,next)=>{
  const {email,mobileNumber,password} = req.body
  // Find User Account
  const user = await User.findOne({$or:[{email},{mobileNumber}]})
  if(!user) return next(new Error('User not found',{cause:404}))
  // Compare Password With Hash
  const isPasswordMatch = bcrypt.compareSync(password,user.password)
  if(!isPasswordMatch) return next(new Error('Invalid password',{cause:401}))
  // Update Status
  user.status = 'online'
  await user.save()
  // Generate Token
  const token = jwt.sign(
    {id:user._id,userName:user.userName,firstName:user.firstName,lastName:user.lastName,role:user.role,DOB:user.DOB},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRY}
  )
  return res.status(200).json({message:"User logged in successfully",token})
} 
/*
-- get data for update from request of body 
-- check the new data doesn’t conflict with any existing data in database (email || mobileNumber)
-- update Date and update UserName 
*/
//! 3--------------------- Update User Account
export const updateAccount = async(req,res,next)=>{
 let { email , mobileNumber , recoveryEmail , DOB , lastName , firstName} = req.body
 const {id} = req.user
//  check the new data doesn’t conflict with any existing data in database
 const check = await User.findOne({$or:[{email},{mobileNumber}]})
  if(check) return next(new Error('Email Or Mobile Duplicate',{cause:409}))
  // Update User
    const user = await User.findByIdAndUpdate(id,{ email , mobileNumber , recoveryEmail , DOB , lastName , firstName },{new:true}).select('-password')
    if(!user) return next(new Error('Something went wrong',{cause:400}))
    if(!firstName) firstName = user.firstName
    if(!lastName) lastName = user.lastName
    user.userName = firstName + ' ' + lastName
    await user.save()
    return res.status(200).json({message:"Account updated successfully",user})
}


//! 4--------------------- Delete User Account
export const deleteAccount = async (req, res) =>{
  const {id} = req.user
  const user = await User.findByIdAndDelete(id).select('-password')
  if(!user) return next(new Error('Something went wrong',{cause:400}))
  return res.status(200).json({message:"Account deleted successfully",user})
}

//! 5--------------------- Get user account data 
export const getAccount = async (req, res,next) =>{
  const {id} = req.user
  const user = await User.findById(id).select('-password')
  if(!user) return next(new Error('Something went wrong',{cause:400}))
  return res.status(200).json({message:"Account fetched successfully",user})
}

//! 6--------------------- Get profile data for another user
export const getUserProfile = async (req, res, next) =>{
    const {id} = req.params
    const findUser = await User.findById(id).select('-password -mobileNumber -email -recoveryEmail -code')
    if(!findUser) return next(new Error('Something went wrong',{cause:400}))
    return res.status(200).json({message:"Account fetched successfully",findUser})

}

/*
-- get newPassword form request body
-- hashed new password
-- updated password
*/
//! 7--------------------- Change password
export const changePass = async (req, res, next) =>{
  const {newPassword} = req.body
  const {id} = req.user
    // HashNewPassword 
    const hashNewPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUND)
    if(!hashNewPassword) return next(new Error('Something went wrong',{cause:400}))
    // update Password
  const user = await User.findByIdAndUpdate(id,{password:hashNewPassword},{new:true}).select('-password')
  if(!user) return next(new Error('Something went wrong',{cause:400}))
  return res.status(200).json({message:"Password changed successfully",user})
}

/*
-- get email from body
-- find this user
-- update code
*/
//! 8---------------------- generate Code
export const getCode = async (req, res, next) =>{
  const {email} = req.body
  const findUser = await User.findOne({email})
  if(!findUser) return next(new Error('Account Notfound',{cause:404}))
  const code = uniqueCode(6)
  findUser.code = code
  await findUser.save()
  res.status(201).json({message:"success",code})
}

/*
-- get email & code & new password 
-- find this account
-- hashed password
-- update password
-- user can`t user this code again
*/
//! 9--------------------- Forget password
export const forgetPass = async (req, res, next) =>{
  const {email,code,newPassword} = req.body
  const findUser = await User.findOne({email})
  if(!findUser) return next(new Error('Account Notfound',{cause:404}))
  if(findUser.code!== code) return next(new Error('Invalid code',{cause:401}))
  // HashNewPassword 
  const hashNewPassword = bcrypt.hashSync(newPassword,+process.env.SALT_ROUND)
  findUser.password = hashNewPassword
  //! user can`t user this code again becouse must be 6 length after get 
  findUser.code = "" 
  await findUser.save()
  res.status(201).json({message:"success"})
}

/*
-- get recoveryEmail from request body
-- find All recovery emails
*/
// get All Emails recovery
export const recovery = async (req, res, next) =>{
  const {recoveryEmail} = req.body
  const findUser = await User.find({recoveryEmail}).select('-password -email -mobileNumber')
  if(!findUser) return next(new Error('Something went wrong',{cause:400}))
  return res.status(200).json({message:"Account fetched successfully",findUser})
}