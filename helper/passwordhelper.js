const bcrypt=require('bcrypt')
const hashpassword=async(password)=>{
    try {
        saltround=10;
        const hashedpassword=await bcrypt.hash(password,saltround)
        console.log("ha haa haa haa")
        return hashedpassword;
        
    } catch (error) {
        console.log(error);
    }
}
const comparepassword=async(password,hashedpassword)=>{
    try{
    console.log("plain password",password)
    console.log("has password",hashedpassword)
    return await bcrypt.compare(password,hashedpassword)
}catch(error){
    console.log(error)
}
}
module.exports={hashpassword,comparepassword};