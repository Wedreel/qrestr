const express=require('express');
const requiresignin = require('../middleware/authmiddleware');
const isAdmin=require('../middleware/authmiddleware');
const usermodel = require('../models/userModel');
const JWT=require('jsonwebtoken');
const { hashpassword } = require('../helper/passwordhelper');
const router=express.Router()


router.get('/users',async(req,res)=>{
    try {
        roles=0;
        const user=await usermodel.find({role:roles})
        res.status(201).send({
            message:"data access success fully",
            success:true,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"user not get",
            error

        })
    }
})


router.post("/loginuser/:email",async(req,res)=>{
    try {
        const {email}=req.params;
      
        const user=await usermodel.findOne({email});
        if(!user){
            return res.status(404).send({
                message:"user not found get register",
                success:true,
                user,
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
                address:user.address,
                role:user.role
            
            },
            token,
        })
    } catch (error) {
        console.log(error)
    }
})



// admin user creattion 
router.post('/adminuser',requiresignin,isAdmin,async(req,res)=>{
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
        res.status(500).send({
            message:"not register",
            success:false,
            error
        })
    }
})

module.exports=router;
