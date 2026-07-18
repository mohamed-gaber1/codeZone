const {validationResult}=require("express-validator");
const Course=require('../models/courses.model');

const getAllCourses=async(req,res)=>{
    const query=req.query;
    const page=Number(query.page)||1;
    const limit=Number(query.limit)||10;
    const skip=(page-1)*limit;
    const  courses =await Course.find({},{'__v':0}).limit(limit).skip(skip);
    res.json({
        status:"success",
        data:courses
    });
};
const getCourse=async(req,res)=>{
        const course =await Course.findById(req.params.courseId)
        if(!course){
            return res.status(404).json({
                status:"fail",
                data:{course:"course not found"}
            })
        }
        res.json({
            status:"success",
            data:course
        });
};
const createCourse=async(req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                    status:"fail",
                    data:error.array()
                });
        }
        const newCorse= new Course(req.body);
        newCorse.save();
        res.status(201).json({
                status:"success",
                data:newCorse
            });
};
const updateCourse=async(req,res)=>{
    const updatedCourse=await Course.findByIdAndUpdate(req.params.courseId,req.body,{new:true});
    if(!updatedCourse){
        return res.status(404).json({
                    status:"fail",
                    data:{course:"course not found"}
                });
    }
    res.json({
                status:"success",
                data:updatedCourse
            });
};
const deleteCourse=async(req,res)=>{
    const deletedCourse=await Course.findByIdAndDelete(req.params.courseId);
    if(!deletedCourse){
        return res.status(404).json({
                    status:"fail",
                    data:{course:"course not found"}
                })
    }
    res.json({
                status:"success",
                data:null
            });
};

module.exports={
    getAllCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}