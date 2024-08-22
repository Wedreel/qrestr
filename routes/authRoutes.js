const express=require('express');
const usermodel = require('../models/userModel');
const { hashpassword, comparepassword } = require('../helper/passwordhelper');
const JWT=require('jsonwebtoken');
const requiresignin = require('../middleware/authmiddleware');
const isAdmin=require('../middleware/authmiddleware')
const router=express.Router()

router.post('/register',async (req,res)=>{
    try {
        const {name,email,password,phone}=req.body;
        if(!name||!email||!password||!phone){
            console.log("required all field ")
        }

        //existing user
        const preuser=await usermodel.findOne({email})
        if(preuser){
            return res.status(200).send({
                success:false,
                message:"already register "
            })
        }
        const hashedpassword =await hashpassword(password)
        
        //registser user 

        const user=await new usermodel({name,email,password:hashedpassword,phone}).save()
        res.status(201).send({
            success:true,
            message:"user registered succesfully",
            user
        })
        
    } catch (error) {
        console.log(error)
        res.status(404).send({
            message:"error occured to register the user ",
            success:false,
            error,
        })
        
    }
});

router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(404).send({
                message:"fill thhe field",
                success:false,

            })
        }
        const user=await usermodel.findOne({email});
        console.log(password)
        console.log(user.password)
        if(!user){
            return res.status(404).send({
                message:"user not found get register",
                success:true,
                user, 
            })
        }

        const match=await comparepassword(password,user.password)

        console.log(match)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            })
            
        }
        const token =await JWT.sign({_id:user._id},process.env.SEC_KEY,{expiresIn:"7d"})
        
        res.status(200).send({
            success:true,
            message:"user logined",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role
            
            },
            token,
        })
    } catch (error) {
        console.log(error)
    }
})


//user protected

router.get("/user-auth",requiresignin,(req,res)=>{
    res.status(201).send({
        success:true,
        ok:true
    })
})

router.get("/admin-auth",requiresignin,isAdmin,(req,res)=>{
    res.status(201).send({
        success:true,
        ok:true
    })
})
module.exports=router;