const mongoose = require("mongoose")


const CompanySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    company_code: {
        type: String,
        required: true,
        unique: true
    },
    owner_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true
    },
    allowedRecruiters: [
        {
            name: String,
            email: String,
        },
    ],
    jobsListed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobs'
    }]
},
    {
        timestamps: true
    }
)

const CompanyModel = mongoose.model("Company", CompanySchema)
module.exports = CompanyModel;