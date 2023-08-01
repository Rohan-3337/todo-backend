const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

// const JWT_SECRET = "qngzmknud"
const JWT_SECRET = process.env.JWT_SECRET


const router = express.Router()
//Route 1: create a user post request createuser
router.post("/createuser", [
    body('name').isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 })
], async (req, res) => {
    let success = false
    const Error = validationResult(req)
    if (!Error.isEmpty()) {
        return res.json({ success,error: Error.array() })
    }
    const { name, email, password } = req.body 
    try {
        let user = await User.findOne({ email })
        if (user) {
            res.statusCode = 400;
            return res.json({success, error: "Sorry a user with email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        user = await User.create({
            name: name, email: email,
            password: hashPassword
        })
        const data = {
            user: {
                id: user.id
            }
        }
        success = true
        const authtoken = jwt.sign(data, JWT_SECRET)
        return res.json({ success,authtoken })

    } 
    catch (error) {
        console.log(error)
        res.send("some internal error")

    }

})
//ROUTE 2 : authenticate a user to login 
router.post("/login", [
    body("email").isEmail(),
    body("password").notEmpty(),
], async (req, res) => {
    let success = false;
    const Error = validationResult(req)
    if (!Error.isEmpty()) {
        return res.json({ error: Error.array() })
    }
    try { 
        const {email,password} = req.body
        let user = await User.findOne({email})
        if(!user){
            
            res.statusCode = 400
            return res.json({success,error:"please try to login with correct email and password"})

        }
        const comparePassword = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            res.statusCode = 400
            return res.json({success,error:"please try to login with correct email and password"})
        }
        const data = { 
            user:{
                id:user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)
        success = true
        return res.json({success,authtoken})
    } catch (error) {
        console.error(error.message)
        res.json({error:"some error occured"})
         
    }

})


//ROUTER 3: get user login required 
router.post("/getuser", fetchuser,async (req, res) => {
    try {
        let userid =req.user.id
        const user = await User.findById(userid).select(['email','name','date'])
        return res.json(user)
    } catch (error) { 
        console.log(error)
        res.json({error:"internal server error"})
    }
})


module.exports = router;