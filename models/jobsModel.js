const mongoose = require("mongoose")


const CompanySchema = mongoose.Schema({
    company_id: {
        type: String,
        required: true,
        immutable: true
    },
    name: {
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
    recruitersList: {
        type: [
            {
                name: String,
                email: String
            }
        ]
    }
},
    {
        timestamps: true
    }
)

const CompanyModel = mongoose.model("Company", CompanySchema)
module.exports = CompanyModel;