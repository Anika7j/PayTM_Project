const express = require("express");
const {creatUser, signin,updateUser} = require("../types");
const {User} = require("../db");
const app = express();
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const { authMiddleware } = require("../middleware");
const router = express.Router();

router.post('/signup',async function(req,res){
    
    const newUser = req.body;
    
    if(!creatUser.safeParse(newUser)){
        res.status(411).json({
            message: "User already exists / Incorrect inputs",
        })
       
    }
    const existingUser = await User.findOne({
        username: newUser.username
    })
    if(existingUser){
        res.status(411).json({
            message: "Username already taken",
        })
    }
    const user = await User.create({
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        Password: creatUser.Password

    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    },JWT_SECRET);
    res.json({
        message: "User created successfully",
        token: "jwt"
    })

    


})

router.post('/signin', async function(req,res,next) {
    const validUser = req.body;
    if(!signin.safeParse(validUser)){
        res.status(411).json({
            message: "Incorrect inputs",
        })
    }
    const user = await User.findOne({username: validUser.username, Password: validUser.Password})
    if(!user){
        res.status(411).json({
            message: "Error while logging in"
        })
    }else{
        const token = jwt.sign({
            userId: user._id
        },JWT_SECRET);
        res.json({
            token: token
        })
    }
})
router.put('/',authMiddleware,async(req,res)=>{
    const user = updateUser(req.body)
    if(!user){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne(req.body,{
        _id: req.userId
    })
    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk',async(req,res)=>{
    const person = req.query.filter || "";
    const users = await User.find({
        $or:[{
            firstName: {
                $regex: person
            }
        },{
            lastName:{
                $regex: person
            }
        }]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = router;