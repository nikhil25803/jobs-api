const mongoose = require("mongoose")


const RecruiterSchema = mongoose.Schema({
    recruiter_id: {
        type: String,
        required: true,
        immutable: true
    },
    company_email: {
        type: String,
        required: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true
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
    linkedin_url: {
        type: String,
        requied: true
    },
    website_link: {
        type: String
    }
},
    {
        timestamps: true
    }
)

const RecruiterModel = mongoose.model("Recruiter", RecruiterSchema)
module.exports = RecruiterModel;