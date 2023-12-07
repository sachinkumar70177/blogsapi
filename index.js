const express=require("express")
require('dotenv').config()
const cors=require("cors")
const { connection } = require("./db")
const { userRouter } = require("./Routes/user.routes")
const { blogsRouter } = require("./Routes/blog.routes")
const app=express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).json({message:"this is blogapp API "})
})
app.use("/users",userRouter)
app.use("/blogs",blogsRouter)
app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("DATABASE IS CONNECTED")
        console.log("conneted ti the port",process.env.PORT)
    } catch (error) {
        console.log(error)
    }
})