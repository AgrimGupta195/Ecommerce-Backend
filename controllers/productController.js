const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async(req,res)=>{
    try{
         const newProduct = await Product.create(req.body);
         res.json(newProduct);
    }catch(err){
        throw new Error(err);
    }
     
});
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
    try{
        const product = await Product.find();
        res.json(product);
    }catch(err){
        throw new Error(err);
    }
})




module.exports = {createProduct,getaProduct,getAllProduct};