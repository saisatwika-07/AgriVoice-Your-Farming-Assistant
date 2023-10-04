require("dotenv").config();
const express =require('express');
const mongoose =require('mongoose');
const cookieParser=require("cookie-parser");

const authRoute=require("./routes/auth");
const toDosRoute = require("./routes/todo");

const app=express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api",(req,res)=>{
  res.send("Todo List");
});
app.use("/api/auth",authRoute);
app.use("/api/todos", toDosRoute);


mongoose.connect(process.env.MONGO_URI).then(()=>{
console.log("Connected to database");
app.listen(process.env.PORT,()=> {
  console.log(`Server running on port ${process.env.PORT}`);
});
}).catch((error)=> {
  console.log(error);
}); 

