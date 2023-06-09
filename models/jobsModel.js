const mongoose = require("mongoose")

// Defining Schema of a Job
const JobsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company_email: {
        type: String,
        required: true,
    },
    job_code: {
        type: String,
        required: true,
        unique: true,
    },
    company_name: {
        type: String,
        required: true
    },
    company_website: {
        type: String,
        required: true
    },
    company_linkedin: {
        type: String,
        required: true
    },
    paid: {
        type: Boolean,
        requied: true
    },
    stipend: {
        type: String,
        required: true
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter'
    },
    appliedBy: [
        {
            name: String,
            username: String,
            email: String,
            resume_link: String
        },
    ],
    selectedCandidates: [
        {
            name: String,
            email: String,
            resume_link: String
        },
    ],
},
    {
        timestamps: true
    }
)

const JobsModel = mongoose.model("Jobs", JobsSchema)
module.exports = JobsModel;