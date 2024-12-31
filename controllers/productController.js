const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
         const newProduct = await Product.create(req.body);
         res.json(newProduct);
    }catch(err){
        throw new Error(err);
    }
     
});
const updateProduct = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);

        }
        const updateproduct = await Product.findOneAndUpdate({_id:id},req.body,{new:true});
        res.json(updateproduct);
    }catch(err){
        throw new Error(err);
    }
})
const deleteProduct = asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);

        }
        const deleteproduct = await Product.findOneAndDelete({ _id:id });
        res.json(deleteproduct);
    }catch(err){
        throw new Error(err);
    }
})
const getaProduct = asyncHandler(async(req,res)=>{
    const{id}=req.params;
    try{
        const product = await Product.findById(id);
        res.json(product);
    }catch(err){
        throw new Error(err);
    }
});


const getAllProduct= asyncHandler(async(req,res)=>{
    console.log(req.query.brand);
    
    try{
        const queryObj = {...req.query};
        console.log(queryObj);
        
        const product = await Product.where('category').equals(req.query.category);
        res.json(product);
    }catch(err){
        throw new Error(err);
    }
})




module.exports = {createProduct,getaProduct,getAllProduct,updateProduct,deleteProduct};