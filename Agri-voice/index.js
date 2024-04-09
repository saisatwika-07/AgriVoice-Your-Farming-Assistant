import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import hbs from "hbs";
import mongoose from "mongoose";
import axios  from "axios";

import keys from "./keys/config.cjs";
import userDetails from "./mongodb.js";
import farmerNews from "./web-scraping-news.js";
import farmerNewsEt from "./web-scraping-et.js";
import {translateText , translateAndSynthesize, synthesizeText} from "./translate.cjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;
const rasaUrl = "http://localhost:5005";


app.use(express.static('public'));
app.use(express.static(path.join(__dirname)));

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
const mongoURL = keys.mongoDbUrl;

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

// Store All responses sent by rasaBot
var rasaResponses = [];
var userPrompts = [];
var combinedData = [];


app.get("/home", isAuthenticated, (req, res) => {
    var rasaIsEmpty = combinedData.length === 0;
    res.render("home", {combinedData, rasaIsEmpty, farmerNews, farmerNewsEt})
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
                combinedData = existingUser.userChat;
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
        rasaResponses = []
        userPrompts = []
        combinedData = []
        // Redirect to the login page 
        res.redirect("/");
    });
});

//function to make the API call and store the response
async function getRasaResponse(userPrompt) {
    try {
        let response = await axios.post(rasaUrl + '/webhooks/rest/webhook', {
            sender: 'Test_user',
            message: userPrompt
        });

        // Extract the 'text' value from the response
        const text = response.data[0].text;

        return text;
    } catch (error) {
        console.error('Error fetching Rasa response:', error);
        return null;
    }
}

// Function to get response from open ai
async function getOpenAiResponse(prompt){
    // Data to be sent in the POST request (in JSON format)
    const postData = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "Act as an expert in the field of agriculture in India, you are an assistant for all farmer's daily needs and help to answer their questions. Keep your answers short and sweet until the user asks for a detailed explanation. Use simple and easy-to-understand vocabulary."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    };

    // Configuring the request headers
    const headers = {
        'Authorization': 'Bearer ' + keys.openaiApiKey
    };

    // HTTPS endpoint URL
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        // Making the POST request using Axios and await its result
        const response = await axios.post(url, postData, { headers });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return 'Im still learning, please try rephrasing the question.';
    }
}



// Post method from UI when user submits prompt

app.post("/postRasa", async (req,res)=>{
    let userPrompt = req.body.userInput;
    let lang = req.body.language;
    let engUserPrompt;
    let rasaResponse;

    
    
    //Convert user given text into engilsh using google cloud

    try {
        engUserPrompt = await translateText(userPrompt, "en-US");
    } catch (error) {
        console.error('Error:', error);
    }


    let rasaText = await getRasaResponse(engUserPrompt);

    if(!rasaText){
        rasaText = await getOpenAiResponse(engUserPrompt);
        // rasaText = "Im unable to understand, please try rephrasing the sentance";
    }

    try {
        rasaResponse = await translateAndSynthesize(rasaText, lang, 'response.mp3');
    } catch (error) {
        console.error('Error:', error);
    }
    combinedData.unshift({rasaResponse: rasaResponse , userPrompt : userPrompt, userLang: lang})
    userPrompts.unshift(userPrompt)
    rasaResponses.unshift(rasaResponse);
    try {
        await updateUserChat(req.session.user.userEmail , combinedData)
    } catch (error) {
        console.log('Failed to updated chat in mongoBD'+ error);
    }
    res.redirect("/home")
})

// synthsising text to audio file
app.post('/playresponse', async (req, res) => {
    const { text } = req.body;
    const { lang } = req.body;
    const outputFile = 'response.mp3'; // Choose a file name
    await synthesizeText(text, lang, outputFile);
    const audioUrl = `http://localhost:3000/${outputFile}`; // Replace your-domain.com with your actual domain
    res.json(audioUrl);
});

// Update user chat in DB

async function updateUserChat(userEmail , updatedChat){
    try {
        const filter = {userEmail : userEmail}
        const update = {userChat : updatedChat}
        const data = await userDetails.findOneAndUpdate(filter , update);
    } catch (error) {
        console.log('Erroe Whilte updateing user chat');
    }
}
