const express=require('express')
const cors=require('cors')
require('dotenv').config()
const contactrouter=require('./routes/contactRoutes.js')
const categoryrouter=require('./routes/categoryRoutes.js')
const productrouter=require('./routes/productRoutes.js')
const connectDB=require('./config/db')
const router=require("./routes/authRoutes.js")
const adminrouter=require('./routes/adminRoutes.js')

connectDB()

const app=express()
app.use(express.json())
app.use(cors())
app.use(router)
app.use(contactrouter)
app.use(categoryrouter)
app.use(productrouter)
app.use(adminrouter)
app.listen(process.env.PORT,()=>{
    console.log("server is ready ")
});