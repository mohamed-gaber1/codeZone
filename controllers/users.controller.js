const User=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");
const getAllUsers=async(req,res)=>{

    console.log(req.headers);

    const query=req.query;
    const page=Number(query.page)||1;
    const limit=Number(query.limit)||10;
    const skip=(page-1)*limit;
    const  users =await User.find({},{'__v':0,'password':0}).limit(limit).skip(skip);
    res.json({
        status:"success",
        data:users
    });
};
const register=async(req,res)=>{
    const oldUser=await User.findOne({email:req.body.email});
    if(oldUser){
        return res.status(400).json({
            status:"fail",
            data:"user alread exist"
            });
    }
    const hashPassword=await bcrypt.hash(req.body.password,10);
    req.body.password = hashPassword;
    if (req.file) {
        req.body.avatar = req.file.filename;
    }
    const newUser= new User(req.body);
    const token=await jwt.sign(
    {
        id:newUser._id,
        email:newUser.email,
        role:newUser.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    }
    );
    newUser.token=token;
    await newUser.save();
    res.status(201).json({
        status:"success",
        data:newUser
        });
};
const login=async(req,res)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user){
        return res.status(401).json({
        status:"fail",
        message:"Invalid email or passward"
        })
    }
    const isMatch=await bcrypt.compare(req.body.password,user.password);
    if(!isMatch){
        return res.status(401).json({
            status:"fail",
            message:"Invalid email or passward"
        })
    }
    const token=await jwt.sign(
    {
        id:user._id,
        email:user.email,
        role:user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    }
    );
    user.token=token;

    res.status(200).json({
        status:"success",
        message:"login success",
        data:{
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            token:user.token
            
        }
    });
};

module.exports={
    getAllUsers,
    register,
    login
    }