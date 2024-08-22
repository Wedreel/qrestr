const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }
    ,
    password:{
        type:String,
        required:true

    },
    phone:{
        type:Number,
        required:true,

    },
    role:{
        type:Number,
        default:0
       },
       categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
       products:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]
})

const usermodel=mongoose.model("users",userSchema)
module.exports=usermodel;