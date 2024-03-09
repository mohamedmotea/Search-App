import mongoose from "mongoose"


const db_connection = async () =>{
  await mongoose.connect(process.env.CONNECTION_URL_DB)
  .then( _=> console.log('DB connection Successfully'))
  .catch(_ => console.log('DB connection failed'))
}

export default db_connection