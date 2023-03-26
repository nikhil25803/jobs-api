const mongoose = require("mongoose")


const CompanySchema = mongoose.Schema({
    company_id: {
        type: String,
        required: true
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
    }
},
    {
        timestamps: true
    }
)

const CompanyModel = mongoose.model("Compnay", CompanySchema)
module.exports = CompanyModel;