const express=require('express')
const requiresignin = require('../middleware/authmiddleware');
const productModel = require('../models/Productmodel');
const usermodel = require('../models/userModel');
const categorymodel = require('../models/Categorymodel');
const { default: slugify } = require('slugify');

const router=express.Router()

//create product 

router.post("/create-product",requiresignin,async(req,res)=>{
    try {
        const {name,description,price,category}=req.body;
        if(!name||!description||!price||!category){
            return res.status(404).send({
                success:false,
                message:"plz entered all field"
            })
        }
        const product=await new productModel({...req.body,category:category,user:req.user._id,slug:slugify(name)}).save()
        await usermodel.findByIdAndUpdate(req.user._id,{$push:{products:product._id}});
        await categorymodel.findByIdAndUpdate(category._id,{$push:{products:product._id}});

        res.status(201).send({
            message:"product is created now",
            success:true,
            product
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error occured while creating the project",
error
        })
    }
})
//get products

router.get("/get-product/:userid/:catid",async(req,res)=>{
    try {
        const {userid,catid}=req.params;
        const products=await productModel.find({user:userid,category:catid})
        console.log("products",products )
        res.status(201).send({
            success:true,
            message:"show list of product",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error to getting the product",
            error
        })
    }


})

//get all products
router.get('/getallproducts/:userid',async(req,res)=>{
    try {
        const {userid}=req.params
        const products=await productModel.find({user:userid}).sort({createdAt:-1})
        res.status(200).send({success:true,message:"all products",products})

        
    } catch (error) {
        res.status(500).send({success:false,message:"error in the products",error})
        
    }
})

router.put("/update-product/:pid",requiresignin,async(req,res)=>{
    try {
        const {name,description,price,category}=req.body;
        if(!name||!description||!price||!category){
            return res.status(404).send({
                message:"data not entered",
                success:false,

            })


        }
        const products=await productModel.findByIdAndUpdate(req.params.pid,{...req.body,slug:slugify(name),user:req.user},{new:true})
        await products.save()
        res.status(200).send({
            success:true,
            message:"product updated successfully",
            products

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:"not updated",
            success:false,
            error

        })
    }
})

// get single product
router.get("/get-product/:slug",async(req,res)=>{
    try {
        const product=await productModel.findOne({slug:req.params.slug})
        res.status(200).send({success:true,message:"single product fetched",
            product
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"not extract the single product",
            error
        })
        
    }
})
//delete

router.delete("/delete-product/:pid",requiresignin,async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.pid)
        res.status(200).send({
            success:true,
            message:"product deleted succesfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while deleting the product...",
            error
        })
    }
})


module.exports=router