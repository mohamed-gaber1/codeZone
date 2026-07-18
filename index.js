const express =require("express");
const app=express();
const path=require("path");
require('dotenv').config()
const cors=require('cors');

app.use('/uploads',express.static(path.join(__dirname,'uploads')));
//-------------------------------------------------------DB---------------------------------------------------
const mongoose=require('mongoose');
const url=process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
    console.log('mongodb server started')
})
//------------------------------------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());

let coursesRouter=require('./routes/courses.route');
let usersRouter=require('./routes/users.route');

app.use('/api/courses',coursesRouter);
app.use('/api/users',usersRouter);

app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found"
    });
});
app.use((err,req,res,next)=>{
    res.status(500).json({
        status:"error",
        message:err.message
    });
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});