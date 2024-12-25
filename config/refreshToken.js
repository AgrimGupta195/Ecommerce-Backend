const jwt = require('jsonwebtoken');

const generaterefreshToken = async (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'3d'});
}

module.exports = {generaterefreshToken};