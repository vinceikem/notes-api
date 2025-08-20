const express = require("express")
const router = express.Router();
const {register,login,refresh,logout} = require("../controllers/authControllers");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");

router.use(rateLimit({
    windowMS: 10 * 60 * 1000,
    max:5,
    message: "Too many attempts. Try again later."

}))

router.post("/register",register);
router.post("/login",login);
router.post("/refresh",refresh);
router.post("/logout",auth,logout);

module.exports = router
