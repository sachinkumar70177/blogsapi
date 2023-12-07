const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 5);
    const user = new UserModel({ username, avatar, email, password: hash });
    await user.save();
    res.status(201).json({ message: "user is registered", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user=await UserModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,function(err,result){
            if(result){
                const token=jwt.sign({userId:user._id,username:user.username},"masai")
                res.status(200).json({message:"Login suceesfull",token})
            }else{
                return res.status(400).json({message:"wrong credentials"})
            }
        })
    }
   
    else{
        return res.status(400).json({message:"wrong credentials"})
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  userRouter,
};
