const express=require('express');
const requiresignin = require('../middleware/authmiddleware');
const categorymodel = require('../models/Categorymodel');
const { default: slugify } = require('slugify');
const usermodel = require('../models/userModel');
const router=express.Router()

// create category
router.post("/create-category",requiresignin,async(req,res)=>{

    try {
        const {name}=req.body;
        

        if(!name){
            return res.status(401).send({
                message:"enter the category"
            })
        }
        // const existingcategory=await categorymodel.findOne({name})
        // if(existingcategory){
        //     return res.status(200).send({
        //         success:true,
        //         message:"already in the database"
        //     });
        // }
        const category=await new categorymodel({name,slug:slugify(name),user:req.user._id}).save()
        await usermodel.findByIdAndUpdate(req.user._id,{$push:{categories:category._id}});
        res.status(201).send({
            success:true,
            message:"successfully created",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"not entered category",
            error
        })
        
    }
})

// update category
router.put("/update-category/:id",requiresignin,async(req,res)=>{
    try {
        const {name}=req.body;
        const {id}=req.params
        const category=await categorymodel.findByIdAndUpdate(id,{name,slug:slugify(name),user:req.user},{new:true})
        res.status(201).send({success:true,message:"update succesfully",category})

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"category not update",
            error
        })
    }
})

// get category

router.get("/categories/:userid",async(req,res)=>{
    try {
        const {userid}=req.params;
        const categories=await categorymodel.find({user:userid});
        res.status(201).send({
            message:"succesfull get",
            success:true,
            categories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"not get categories",
            error
        })
    }
})
//get single category
router.get("/get-category/:userid/:slug",async(req,res)=>{
    try {
        const {userid}=req.params;

        const category=await categorymodel.findOne({slug:req.params.slug,user:userid})
        res.status(201).send({
            success:true,
            message:"get category ",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"not get individual category",
            error
        })
    }
})

router.delete('/delete-category/:id',requiresignin,async(req,res)=>{
    try {
        const {id}=req.params;
        const category=await categorymodel.findByIdAndDelete(id,{user:req.user});
        res.status(201).send({
            success:true,
            message:"deleted",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"not deleted",
            error
        })
        
    }
    


})
module.exports=router;