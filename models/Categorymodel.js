const mongoose=require('mongoose')

const CategorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true

    }
    ,
    slug:{
        type:String,
        lowercase:true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products:[{type:mongoose.Schema.Types.ObjectId,ref:'Product',required: true}]
    
})
const categorymodel=mongoose.model('Category',CategorySchema)
module.exports=categorymodel;