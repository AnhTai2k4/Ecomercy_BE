const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: false},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false, required: false},
        phone: {type: String, required: false},
        accessToken: {type: String, required: false},
        refreshToken: {type: String, required: false},
    },
    {
        timestamps:true
    }
    
)

const User = mongoose.model("User", userSchema)
module.exports = User
