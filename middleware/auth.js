const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token= req.headers.authorization
    if(token){
        jwt.verify(token,"masai",(err,decoded)=>{
            // console.log(decoded)
            if(decoded){
                req.body.userId=decoded.userId;
                req.body.username=decoded.username
                next()
            }else{
                // console.log(1)
                return  res.status(400).json({msg:"you are not authorised"})
            }
        })
    }else{
        res.status(400).json({msg:"you are not authorised"})
    }
}

module.exports={
    auth
}