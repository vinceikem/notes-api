const mongoose = require("mongoose");
const refreshTokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token:{type:String,required:true},
    tokenId:{type:String,required:true},
    expiresAt:{
        type:Date,
        default: () => new Date(Date.now()+7*24*60*60*1000)
    },
},{timestamps:true});
refreshTokenSchema.index({expiresAt:1},{expireAfterSeconds:0});

const RefreshToken = mongoose.model("RefreshToken",refreshTokenSchema);
module.exports = RefreshToken;