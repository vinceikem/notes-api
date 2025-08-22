const User = require("../models/user");
const errorMessage = require("../utils/errorMessage")
const crypto = require("crypto")
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokens");
require("dotenv").config();

const register = async (req, res) => {
    const body = req.body;
    if (!body || Object.keys(body) < 1) {
        return res.status(400).json({ success: false, message: "JSON body required" })
    }
    const { username = "", password="" } = body;

    try {
        const foundUsername = await User.find({ username: username });
        if (!username || username.length < 3) {
            return errorMessage(res, 400, "Username must be more than 2 characters")
        }
        if (foundUsername.length > 0) {
            return errorMessage(res, 400, "Username already exists");
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
            return errorMessage(res, 400, "Password must constain at least one number,one uppercase,one symbol and must be greater than 7 characters")
        }
        try {
            const hashedPassword = await argon2.hash(password)
            const newUser = new User({ username: username, password: hashedPassword })
            await newUser.save();
            return res.status(201).json({ success: true, message: "User Created Successfully" })
        } catch (error) {
            return errorMessage(res, 500, `An error occured ${error}`)
        }

    } catch (error) {
        return errorMessage(res, 500, "A server error occured");
    }


}

async function refreshToken(userId) {
    try {
        let refreshToken = await RefreshToken.findOne({ userId: userId }).token;
        const refreshTokenCount = await RefreshToken.countDocuments({ userId: userId })
        if (!refreshToken || refreshTokenCount < 3) {
            const rshTokenId = crypto.randomUUID();
            refreshToken = jwt
                .sign({
                    userId: userId, type: "refresh", tokenId: rshTokenId
                },
                    process.env.SECRET_RSH_KEY,
                    { expiresIn: process.env.RSH_KEY_EXP });
            const hashedToken = argon2.hash(refreshToken);
            const newRefreshToken = new RefreshToken({ tokenId: rshTokenId, token: hashedToken, userId: userId })
            await newRefreshToken.save();
        }
        return { success: true, token: refreshToken }
    } catch (error) {
        return { success: false, status: 500, message: "An error occured generating refresh token" }
    }

}

const login = async (req, res) => {
    const body = req.body;
    if (!body && Object.keys(body).length < 1) {
        return errorMessage(res, 400, "JSON body required");
    }
    const { username, password } = body;
    const user = await User.find({ username: username });
    const userId = user[0].id
    const userTokenVersion = user[0].tokenVersion;
    const hashedPassword = user.at(0).password;
    try {
        const verified = await argon2.verify(hashedPassword, password)
        if (!user.length < 1 && !verified) {
            return errorMessage(res, 404, "Invalid Credidentials")
        }
        const accessToken = jwt
            .sign({
                id: userId,
                username: username,
                tokenVersion:userTokenVersion,
            },
                process.env.SECRET_JWT_KEY,
                { expiresIn: "1h" });
        let rshToken = await refreshToken(userId)
        if (!rshToken.success) {
            return errorMessage(res, rshToken.status, rshToken.message)
        }
        rshToken = rshToken.token


        res.json({ success: true, user: user.at(0).username, accesstoken: accessToken, refreshToken: rshToken })
    } catch (err) {
        return res.status(500).json({ success: false, message: "An error occured" })
    }



}

const refresh = async (req, res) => {
    const refreshToken = req.headers["x-refreshtoken"];
    try {
        const unhashedToken = argon2.verify(refreshToken) 
        const decode = jwt.verify(unhashedToken, process.env.SECRET_RSH_KEY);
        if (!refreshToken || !decode) {
            return errorMessage(res, 401, "Invalid refresh token");
        }
        if ((await RefreshToken.find({ token: refreshToken, userId: decode.userId })).length < 1) {
            return errorMessage(res, 403, "Token Invalid")
        }

        const user = await User.findById(decode.userId)
        if (!user) {
            return errorMessage(res, 400, "Invalid Refresh Token")
        }
        const newAccessToken = jwt.sign({ id: decode.userId, username: user.username, tokenVersion:user.tokenVersion}, process.env.SECRET_JWT_KEY, { expiresIn: "1h" });
        res.json({ success: true, user: user.username, accessToken: newAccessToken, });
    }
    catch (err) {
        errorMessage(res, 500, "Error generating new access token");
    }

}

const logout = async (req, res) => {
    const user = req.user;
    if(!user){
        return errorMessage(res,400,"Error auth session");
    }
    try{
    await RefreshToken.deleteMany({userId:user.id});
    await User.updateOne({_id:user.id},{$inc:{tokenVersion : 1}});
    res.json({success:true,message:"Successfully logged out"});
    }catch(e){
        return errorMessage(res,500,"Error logging out");
    }
}

module.exports = {register, login, refresh, logout}