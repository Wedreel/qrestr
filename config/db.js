
const mongoose=require('mongoose');
const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.DB)
        console.log("database connected")
        
    } catch (error) {
        console.log(error)
        
    }
}
module.exports=connectDB;