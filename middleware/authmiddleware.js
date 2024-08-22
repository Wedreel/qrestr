const JWT=require('jsonwebtoken')


const requiresignin=async (req,res,next)=>{
    try {
        const decode=JWT.verify(
            req.headers.authorization,process.env.SEC_KEY

        );
        console.log("requiresignin",decode)
        req.user=decode;
        next();
    } catch (error) {
        console.log(error)
    }
};

const isAdmin=async (req,res,next)=>{
    try {
        const user= await userModel.findById(req.user._id);
        if(user.role!==1){
            return res.status(401).send({
                success:false,
                message:"unauthorized admin access",
             
            })
            
        }else{
            
            next()

        }
    } catch (error) {
        
        res.status(401).send({
            success:false,
            error,
            message:"aldjf;lasd"
        })
    }
}
module.exports=requiresignin,isAdmin;