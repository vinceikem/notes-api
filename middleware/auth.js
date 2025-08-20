const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req,res,next) => {
    const header = req.headers["authorization"]
    if(!header){
        return res.status(401).json({success:false,message:"No token supplied"})
    }
    const token = header.split(" ")[1] || ""
    if(token.length < 1){
        return res.status(401).json({success:false,message:"No token supplied"})
    }
    try {
        const verified = jwt.verify(token,process.env.SECRET_JWT_KEY)
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({success:false,message:"Token is no longer valid"})
    }
    
}

module.exports = auth