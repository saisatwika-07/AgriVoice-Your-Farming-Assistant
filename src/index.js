import express from "express";
import path from "path";
const app = express();
const port = 3000;

app.get("/",function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})