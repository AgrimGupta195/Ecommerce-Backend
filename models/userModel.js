const mongoose = require('mongoose');
const { Schema } = mongoose
const bcrypt = require('bcrypt');
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default:[],
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishList: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken:{
        type:String,
    }
    },{
        timestamps:true,
    }
);
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
})
userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
module.exports = mongoose.model('User', userSchema);