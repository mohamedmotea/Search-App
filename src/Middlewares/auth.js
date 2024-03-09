
import  jwt  from 'jsonwebtoken';
import User from '../../DB/Models/user.model.js';
const auth = (roles)=>{
  return async(req,res,next)=>{
    try {
      const {accesstoken} = req.headers
      if(!accesstoken) return next(new Error('accesstoken notfound',{cause:404}));
       if(!accesstoken.startsWith(process.env.PREFIX)) return next(new Error('Prefix not found',{cause:404}));
      const token = accesstoken.split(process.env.PREFIX)[1]
      const data = jwt.verify(token, process.env.JWT_SECRET )
      const validToken = await User.findById(data.id)
      if(!validToken) return next(new Error('invalid token',{cause:404}));
      if(!roles.includes(validToken.role)) return next(new Error('unauthorized',{cause:401}));
      req.user = data
      next()
    } catch (error) {
      return next(new Error(error,{cause:500}));
    }
  }

}

export default auth