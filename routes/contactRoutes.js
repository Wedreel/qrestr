const express=require('express');
const usercontact = require('../models/Contacts');

const router=express.Router()


router.post('/contact',async (req,res)=>{
    try {
        const {name,email,phone,message}=req.body;
        if(!name||!email||!phone||!message){
            console.log("enter some data")

        }
        const contactdata=await new usercontact({name,email,phone,message}).save()
        res.status(201).send({
            message:"data entered succesfully",
            success:true,
            contactdata
        })
        
    } catch (error) {
        res.status(404).send({
            message:"data not entered",
            success:false,
            error
        })
    }
})

module.exports=router;