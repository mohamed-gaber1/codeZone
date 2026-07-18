const express=require("express");
const router=express.Router();
let coursesController=require('../controllers/courses.controller')
const {body,validationResult}=require("express-validator");
const asyncWrapper=require('../middleware/asyncWrapper');
const verifyToken =require("../middleware/verifyToken");
const allowedTo =require("../middleware/allowedTo");

// get all courses
router.get("/",asyncWrapper(coursesController.getAllCourses));

//get one course
router.get("/:courseId",asyncWrapper(coursesController.getCourse));

//creat new course
router.post('/',
    body("title").
        notEmpty()
        .withMessage("title is require")
        .isLength({min:2})
        .withMessage("title at least is 2 degits"),
    body("price")
        .notEmpty()
        .withMessage("price is required"),verifyToken,asyncWrapper(coursesController.createCourse)
    );

//update data
router.patch('/:courseId',asyncWrapper(coursesController.updateCourse));

//delete data
router.delete('/:courseId',verifyToken,allowedTo("ADMIN","MANGER"),asyncWrapper(coursesController.deleteCourse));
//--------------------------------------------------------------------------------------------------------------------
//في كسم حاجه في الاكسبرس بتقول اننا ممكن نخليها
//router.route وحده بدل متعمل لكل وحد بس لازم يكون الالنك شبه بعضه

// router.route('/')
// .get(coursesController.getAllCourses)
// .post(
//     body("title").
//     notEmpty()
//     .withMessage("title is require")
//     .isLength({min:2})
//     .withMessage("title at least is 2 degits"),
//     body("price")
//     .notEmpty()
//     .withMessage("price is required")
//     ,coursesController.createCourse);
//     router.route('/:courseId')
//     .get(coursesController.getCourse)
//     .patch(coursesController.updateCourse)
//     .delete(coursesController.deleteCourse);
    
    
    
    
    module.exports=router;