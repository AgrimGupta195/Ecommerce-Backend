const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const authMiddleware = asyncHandler(async(req,res,next)=>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded =  jwt.verify(token,process.env.JWT_SECRET);
                const user = await User.findById(decoded.id);
                req.user=user;
                next();
            }
        }catch(err){
            throw new Error("Not Authorized login again");
        }
    }
    else{
        throw new Error("there is no token");
    }
})
const isAdmin=asyncHandler(async(req,res,next)=>{
    const{email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role!=='admin'){
        throw new Error("Your are not admin");
    }else{
        next();
    }

})
module.exports = {authMiddleware,isAdmin};