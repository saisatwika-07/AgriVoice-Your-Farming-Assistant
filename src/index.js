import express from "express";
import path from "path";
import hbs from "hbs";
import mongoose from "mongoose";

import  userDetails from "./mongodb.js";

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());
app.set("view engine","hbs");
app.use(express.urlencoded({extended:false}));

//connect to cloud mongoDB
const mongoURL = "mongodb+srv://revanthdanduboina:Welcome123@logindetails.qab1dl6.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoURL).then(()=>{
    console.log("MongoDB Connection Successful");
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
}).catch(()=>{
    console.log("MongoDB connection failed");
})


app.get("/",function(req,res){
    res.render("login")
});

app.get("/register",function(req,res){
    res.render("register")
});

app.post("/register",async(req,res)=>{

    try {
        const existingUser = await userDetails.findOne({ userEmail: req.body.userEmail });

        if (existingUser) {
            const errorMessage = "User already exists, please Sign-in";
            return res.render("register", { error: errorMessage });
        }

        // If user doesn't exist, proceed with registration
        const formData = new userDetails({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            password: req.body.password
        });

        formData.save()
            .then((result) => {
                console.log("Registration successful");
                res.render("home");
            })
            .catch((err) => {
                console.log("Registration Failed");
                console.log(err);
                res.render("register", { error: "Registration failed, Please try again." });
            });
    } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).render("register", { error: "Internal Server Error, Please try again." });
    }
})

