const mongoose = require("mongoose")


const RecruiterSchema = mongoose.Schema({
    company_email: {
        type: String,
        required: true,
        immutable: true
    },
    company_code: {
        type: String,
        requied: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    password: {
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
    linkedin_url: {
        type: String,
        requied: true
    },
    website_link: {
        type: String
    },
    jobsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs'
    }]
},
    {
        timestamps: true
    }
)

const RecruiterModel = mongoose.model("Recruiter", RecruiterSchema)
module.exports = RecruiterModel;