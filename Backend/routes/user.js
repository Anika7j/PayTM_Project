const express = require("express");

const {User,Account} = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config");
const { authMiddleware } = require("../middleware");
const router = express.Router();
const zod = require('zod');

const createUser = zod.object({
    username: zod.string().min(1).max(50),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(8),
})



router.post('/signup',async function(req,res){
    
    
    const newUser = req.body;
    
    if(!createUser.safeParse(newUser)){
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
        Password: newUser.password

    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random()*10000
    })

    const token = jwt.sign({
        userId
    },JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

})



const signin = zod.object({
    username: zod.string(),
    password: zod.string(),
})

router.post('/signin', async function(req,res) {
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

const updateUser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})

router.put('/',authMiddleware,async(req,res)=>{
    const user = updateUser.safeParse(req.body)
    if(!user){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne(req.body,{
        id: req.userId
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
                "$regex": person
            }
        },{
            lastName:{
                "$regex": person
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