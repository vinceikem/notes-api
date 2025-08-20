const User = require("../models/user");
const errorMessage = require("../utils/errorMessage")
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async(req,res) => {
    const body = req.body;
    if(!body || Object.keys(body) < 1){
        return res.status(400).json({success:false,message:"JSON body required"})
    }
    const {username="",password} = body;
    console.log("username",username)
    console.log("password",password)
    
    try {
        const foundUsername = await User.find({username:username});
        if(!username || username.length < 3){
            return errorMessage(res,400,"Username must be more than 2 characters")
        }
        if(foundUsername.length > 0){
            return errorMessage(res,400,"Username already exists");
        }
        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)){
            return errorMessage(res,400,"Password must constain at least one number,one uppercase,one symbol and must be greater than 7 characters")
        }
        try {
            console.log("HashingPassword")
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({username:username,password:hashedPassword})
            await newUser.save();
            return res.status(201).json({success:true,message:"User Created Successfully"})
        } catch (error) {
            return errorMessage(res,500,`An error occured ${error}`)
        }
        
    } catch (error) {
        return errorMessage(res,500,"A server error occured");
    }
    

}

const login = async(req,res) => {
    const body = req.body;
    if (!body && Object.keys(body).length < 1){
        return errorMessage(res,400,"JSON body required");
    }
    const {username,password} = body;
    const user = await User.find({username:username});
    //console.log(user)
    const userId = user[0].id
    //const userName = user[0].username
    const userPassword = user.at(0).password;
    console.log(userPassword);
    try{const verified = await argon2.verify(userPassword,password)
    if(!user.length < 1 && !verified){
        return errorMessage(res,404,"Invalid Credidentials")
    }
    const tempJWT = jwt.sign({id:userId,username:username},process.env.SECRET_JWT_KEY,{expiresIn:"1d"})
    res.json({success:true,user:user.at(0).username,token:tempJWT})}catch(err){
        return res.status(500).json({success:false,message:"An error occured"})
    }
    


}

module.exports= {register,login}