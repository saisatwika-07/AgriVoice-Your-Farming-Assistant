import express from "express";
import session from "express-session";
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

// Setting up express-session for storing user authentication

app.use(session({
    secret: 'Mlrit_cse03', // Change this to a strong, unique key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
              maxAge: 86400000} // Set to true if using HTTPS
}));

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
    if(req.session.user){
        return res.redirect("/home");
    }
    
    res.render("login")
});

app.get("/register",function(req,res){
    if(req.session.user){
        return res.redirect("/home");
    }

    res.render("register")
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        res.redirect("/");
    }
};

app.get("/home", isAuthenticated, (req, res) => {
    res.render("home");
});



//User registration on form submission
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
            userEmail: req.body.userEmail.toLowerCase(),
            password: req.body.password
        });

        formData.save()
            .then((result) => {
                console.log("Registration successful");
                res.redirect("/");
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
});

//User login validation
app.post("/login",async(req,res)=>{

    var loginEmail = req.body.userEmail.toLowerCase();
    var loginPassword = req.body.password;

    try {
        const existingUser = await userDetails.findOne({ userEmail: loginEmail });
        //checking if user is present in DB or not
        if (existingUser) {
            //checking if password matches with user or not
            if(existingUser.password === loginPassword){
                console.log("Login Successful");
                
                //Storeing user login authuntication details in session
                req.session.user = {
                    userName: existingUser.userName,
                    userEmail: existingUser.userEmail,
                    password: existingUser.password
                };

                return res.redirect("/home");
            }else{
                let errorMessage = "Wrong password, please recheck again.";
                return res.render("login", { error: errorMessage });
            }
            
        }else{
            let errorMessage = "Email not found in records, please Register";
            return res.render("login", { error: errorMessage });
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).render("login", { error: "Internal Server Error, Please try again." });
    }
})


//User logout logic

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
        // Redirect to the login page or any other desired page after logout
        res.redirect("/");
    });
});