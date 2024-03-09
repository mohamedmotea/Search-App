
const reqKeys = ['body','headers','params','query'];

const vld = (schema)=>{
return (req,res,next)=>{

  const errors = [];

  for(const key of reqKeys) {
    const validationResult = schema[key]?.validate(req[key],{abortEarly:false});
    if(validationResult?.error) {
      errors.push(...validationResult.error.details);
    }
  }
  if(errors.length) {
  
    return res.status(400).json({errors: errors.map(err => err.message)});
  }
  next();
}

}

export default vld;