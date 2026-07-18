const jwt =require("jsonwebtoken");

const verifyToken=(req,res,next)=>{
    const authHeader = req.headers['Authorization']||req.headers['authorization']
    if(!authHeader){
        return res.status(401).json('token is required');
    }
    const token = authHeader.split(' ')[1];
    try{
        const decodedToken= jwt.verify(token,process.env.JWT_SECRET);
        req.decodedToken=decodedToken;
        next();
    }catch(err){
        return res.status(401).json('invalid token');
    }
}
module.exports=verifyToken;