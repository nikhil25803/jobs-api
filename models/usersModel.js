const mongoose = require("mongoose")


const UserSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    github_url: {
        type: String,
        required: true
    },
    linkedin_url: {
        type: String,
        requied: true
    },
    resume_link: {
        type: String
    }
})

const UserModel = mongoose.model("Users", UserSchema)
module.exports = UserModel;