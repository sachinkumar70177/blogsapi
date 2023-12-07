const express = require("express");
const { auth } = require("../middleware/auth");
const { BlogModel } = require("../model/blogs.model");
const blogsRouter = express.Router();

blogsRouter.get("/", auth, async (req, res) => {
  const { title, category, sort, order } = req.query;
  let query = {};
  let sortoptions = {};
  if (title) {
    query.title = { $regex: title, };
  }
  if (category) {
    query.category = category;
  }
  if (sort && order) {
    sortoptions[sort] = order === "asc" ? 1 : -1;
  }
  try {
    const blogs = await BlogModel.find(query).sort(sortoptions);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

blogsRouter.post("/create",auth, async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const blog = new BlogModel({
      title,
      content,
      category,
      username: req.body.username,
      user: req.body.userId,
      commet:[]
    });
    await blog.save()
    res.status(201).json({message:"blog is created",blog})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
});

blogsRouter.patch("/update/:id",auth,async(req,res)=>{
    try {
        const {id}=req.params;
        const {content}=req.body
        const post=await BlogModel.findById(id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        if(post.username!==req.body.username){
            return res.status(404).json({msg:"you are not authorised"})
        }

        if(content){
            post.content=content
        }
        await post.save()
        res.status(200).json({msg:"post updated"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})



blogsRouter.delete("/delete/:id",auth,async(req,res)=>{
    try {
        const {id}=req.params;
        
        const post=await BlogModel.findById(id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        if(post.username!==req.body.username){
            return res.status(404).json({msg:"you are not authorised"})
        }

        const deletepost=await BlogModel.findByIdAndDelete(id)
        res.status(200).json({msg:"post deleted"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})
blogsRouter.post("/:id/like",auth,async(req,res)=>{
    const blogId=req.params.id;
    try {
        const post=await BlogModel.findById(blogId)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        post.likes+=1
        const updatedpost=await post.save()
        res.status(200).json({message:"likes are updated"})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

blogsRouter.post("/:id/comment",auth,async(req,res)=>{
    const blogId=req.params.id;
    const {content}=req.body
    try {
        const post=await BlogModel.findById(blogId)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        post.comments.push({username:req.body.username,content})
        const updatedpost=await post.save()
        res.status(200).json({message:"comments are updated"})
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
})

module.exports = {
  blogsRouter,
};
