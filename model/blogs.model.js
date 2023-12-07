const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
    username:{type:String},
    title:{type:String,required:true},
    content:{type:String,required:true},
    category:{type:String,required:true,enum:['Business', 'Tech', 'Lifestyle', 'Entertainment']},
    date:{type:Date,
    default:Date.now},
    likes:{type:Number,
    default:0},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    comments:[{ username:{type:String,required:true},content:{type:String,required:true}}]

},{
    versionKey:false
})

const BlogModel=mongoose.model("blog",blogSchema)

module.exports={
    BlogModel
}