const express = require("express")
const router = express.Router();
const {register,login,refresh,logout} = require("../controllers/authControllers");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");

const ratelim = ()=> rateLimit({
    windowMS: 10 * 60 * 1000,
    max:5,
    message: "Too many attempts. Try again later."

});

router.post("/register",ratelim,register);
router.post("/login",ratelim,login);
router.post("/refresh",refresh);
router.post("/logout",ratelim,auth,logout);

module.exports = router
