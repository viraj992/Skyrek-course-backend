import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone :  {
        type : String,
        default : "NOT GIVEN"
    },
    isBlocked :  {
        type : Boolean,
        default : false
    },
    role :  {
        type : String,
        default : "user"
    },
    isEmailVerified :  {
        type : Boolean,
        default : false
    },
    image :{
        type : String,
        default : "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"

    }
})

const User = mongoose.model("users", userSchema)

export default User;