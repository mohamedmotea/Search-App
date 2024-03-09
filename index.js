import { config } from 'dotenv'
import express from 'express'
import db_connection from './DB/connection.js';
import globalResponse from './src/Middlewares/globalResponse.js';
import userRouter from './src/Modules/User/user.router.js';
import companyRouter from './src/Modules/Company/company.router.js';
import jobRouter from './src/Modules/Job/job.router.js';

config({path:'./config/dev.config.env'})
const app = express()
const port = process.env.PORT 

app.use(express.json())

db_connection()


app.use('/user',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)

app.use(globalResponse)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))