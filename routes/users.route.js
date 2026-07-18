const express=require("express");
const router=express.Router();
const asyncWrapper=require('../middleware/asyncWrapper');

const multer = require('multer');
const diskStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename:function(req,file,cb){
        const ext=file.mimetype.split('/')[1];
        const fileName=`user-${Date.now()}.${ext}`
        cb(null,fileName);
    }
})
fileFilter=(req,file,cb)=>{
    const image=file.mimetype.split('/')[0];
    if(image==='image'){
        cb(null,true);
    }else{
        cb(new Error("only image can upload"),false);
    }
}
const upload = multer({storage:diskStorage, fileFilter:fileFilter})

const usersController=require('../controllers/users.controller');
const veriftToken =require("../middleware/verifyToken");
//get all users
router.get("/",veriftToken,asyncWrapper(usersController.getAllUsers));
//register
router.post("/register",upload.single('avatar'),asyncWrapper(usersController.register));
//login
router.post("/login",asyncWrapper(usersController.login));


module.exports=router;
