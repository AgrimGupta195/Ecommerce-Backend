const mongoose= require('mongoose');
require('dotenv').config();

const dbConnect = ()=>{
    try{
        const connect = mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected SuccesFully");
        
    }catch(err){
        console.log(err);
    }
}

module.exports = dbConnect;