const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken } = require('../config/jwtToken');
const{validateMongooseDbId}=require('../utils/validateMongodbId');
const { generaterefreshToken } = require('../config/refreshToken');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


const createUser = asyncHandler(async(req,res)=>{
    const {email,firstname,lastname,password,mobile} = req.body;
    const findUser = await User.findOne({email});
    if(!findUser){
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            mobile,
            password,
        })
        res.json(newUser);
    }else{
        throw new Error("User Already Exist")
    }
})
const loginUser = asyncHandler(async(req,res)=>{    
    const {email,password} = req.body;
    const findUser = await User.findOne({email});
    if(findUser){
        const isMatch = await findUser.isPasswordMatched(password);
        if (isMatch) {
            const token = await generateToken(findUser._id);
            const generatedRefreshToken = await generaterefreshToken(findUser._id);
            const updateUser = await User.findByIdAndUpdate(findUser._id,{
                refreshToken:generatedRefreshToken,
            },{
                new:true,
            })
            res.cookie('refreshToken', generatedRefreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            });
            res.json({
                id:findUser?._id,
                firstname:findUser?.firstname,
                lastname:findUser?.lastname,
                email:findUser?.email,
                token:token,
            });
        }else{
            throw new Error("Invalid Credentials");
        }
    }else{
        throw new Error("User Already Exist")
    }
})



const handleRefreshToken = asyncHandler(async(req,res)=>{
 const cookie = req.cookies;
 if(!cookie.refreshToken) throw new Error("No RefreshToken in Cookie");
 const refreshToken = cookie.refreshToken;
 const user = await User.findOne({refreshToken});
 if(!user) throw new Error("no token");
 jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
    if(err || user.id !== decoded.id){
        throw new Error("There is Something worng with refreshToken");
    }
    const accessToken = generateToken(user._id);
    
    res.json({
        accessToken,
        user: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        }
    });
 })
 
});

const logout = asyncHandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error("No RefreshToken in Cookie");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204); // forbidden
    }
    User.findOneAndUpdate(refreshToken,{
        refreshToken:"",
    });
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204);
})
const updateUser = asyncHandler(async(req,res)=>{
    const{_id}=req.user;
    validateMongooseDbId(_id);
    const{email,lastname,firstname,mobile}=req.body;
    try{
        const updateuser = await User.findByIdAndUpdate(id,{
            firstname,
            lastname,
            email,
            mobile,
        },{
            new:true,
        })
        res.json(updateuser);
    }catch(err){
        throw new Error(err);
        
    }
})


const getAllUser = asyncHandler(async(req,res)=>{
    try{
        const getUser = await User.find();
        res.json(getUser);
    }catch(err){
        throw new Error(err);
    }
});  

const getSingleUser = asyncHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongooseDbId(id);
    try{
        const getuser = await User.findById(id);
        res.json(getuser);
    }catch(err){
        throw new Error(err);
    }
})
const deleteUser = asyncHandler(async(req,res)=>{
    const{id}=req.params;
    validateMongooseDbId(id);
    try{
        const deleteuser = await User.findByIdAndDelete(id);
        res.json(deleteuser);
    }catch(err){
        throw new Error(err);
    }
})

const blockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongooseDbId(id);
    try{
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true,
        },{
            new:true,
        }
    ); res.json({message:"User Blocked"});
    }catch(err){
        throw new Error(err)
    }
})
const unblockUser = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongooseDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked:false,
        },{
            new:true,
        }
    );
    res.json({message:"User unBlocked"});
    }catch(err){
        throw new Error(err)
    }
})
module.exports = {createUser,loginUser,handleRefreshToken,getAllUser,getSingleUser,deleteUser,updateUser,blockUser,unblockUser,logout};