const mongoose = require("mongoose")

// Defining Schema of a User
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
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
    },
    appliedAt: [
        {
            company_name: String,
            company_email: String,
            job_code: String,
        }
    ],
    selectedAt: [
        {
            job_code: String,
            company_name: String,
            company_email: String,
            recruiter_email: String
        }
    ],
},
    {
        timestamps: true
    }
)

const UserModel = mongoose.model("Users", UserSchema)
module.exports = UserModel;