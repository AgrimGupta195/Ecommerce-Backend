const mongoose = require('mongoose');
const validateMongooseDbId = (id)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid){
        throw new Error('This id is Not valid or not found');
    }
}

mongoose.exports = {validateMongooseDbId};