const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const auth = async (req,res,next) => {
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
        const fetchedUser = await User.findById(verified.id) 
        if(fetchedUser.tokenVersion !== verified.tokenVersion){
            res.status(401).json({success:false,message:"Invalid Access Token"})
        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({success:false,message:"Token is no longer valid"})
    }
    
}

module.exports = auth