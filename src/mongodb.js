import mongoose from "mongoose";


const RegisterSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const userDetails = mongoose.model('userDetail', RegisterSchema);

export default userDetails;