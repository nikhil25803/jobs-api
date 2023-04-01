const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const CompanyModel = require("../models/companyModel")
const jwt = require("jsonwebtoken")


// Register a company
const registerCompany = asyncHandler(async (req, res) => {

    // Retreiving the company's attributes
    const {
        name,
        company_code,
        owner_name,
        owner_email,
        email,
        password,
        confirm_password,
        linkedin_url,
        website_link,
    } = req.body


    // Cehck if all the required body is passed or not
    if (!name || !owner_name || !owner_email || !email && !password || !confirm_password || !website_link || !linkedin_url) {
        res.status(400);
        throw new Error("All fields are required")
    }

    // Check if password and confirm password matches
    if (password !== confirm_password) {
        res.status(400);
        throw new Error("Password and Confirm Password must match")
    }


    // Check username
    const comapnyAvailable = await CompanyModel.findOne({ email })
    if (comapnyAvailable) {
        res.status(400);
        throw new Error(`Company Code: ${username} is already taken`)
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)


    // Try to upload the file as well as crete a new object.
    try {
        const newCompany = await CompanyModel.create({
            name,
            company_code,
            owner_name,
            email,
            password: hashedPassword,
            linkedin_url,
            website_link,
            allowedRecruiters: [{
                name: owner_name,
                email: owner_email
            }]
        })
        res.status(201).json({
            "status": res.statusCode,
            "message": "New Company has been created sucessfully",
            "data": newCompany
        })
    } catch (err) {
        res.status(500)
        throw new Error("Unable to create a new company")
    }
})


// Login as a company
const companyLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("Both email and password is required")
    }

    // Checking if the a company with the email entered exist or not.
    const company = await CompanyModel.findOne({ email })
    if (company && bcrypt.compare(password, company.password)) {

        // The following details will be provided when a company logged in.
        const accessToken = jwt.sign({
            company: {
                id: company._id,
                company_code: company.company_code,
                owner_name: company.owner_name,
                email: company.email,
                linkedin_url: company.linkedin_url,
                website_link: company.website_link,
                allowedRecruiters: company.allowedRecruiters,
                jobsListed: company.jobsListed,
            }
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "30m" })
        res.status(200).json({
            "status": res.statusCode,
            "message": `Company with id: ${company.company_id} has `,
            "token": accessToken
        })
    }
})

// Get the company details
const companyDetails = asyncHandler(async (req, res) => {
    const company_code = req.params.company_code

    // Verifying that the mentioned company code matches with loggedin company's code or not.
    if (company_code === req.user.company_code) {
        const comapanyInDatabase = await CompanyModel.findOne({ company_code })
        if (comapanyInDatabase) {
            res.status(200).json({
                "status": res.statusCode,
                "data": comapanyInDatabase
            })
        } else {
            res.status(404).json({
                "status": res.statusCode,
                "message": "Company is not available"
            })
        }
    } else {
        res.status(500)
        throw new Error("Company is either not loggedin or not available")
    }
})

// Update any detail of a company.
const updateCompanyDetails = asyncHandler(async (req, res) => {
    const company_code = req.params.company_code

    if (company_code !== req.user.company_code) {
        res.status(401)
        throw new Error(`Comany with id: ${company_code} is either not loggedin or incorrect`)
    }


    const updatedDetails = await CompanyModel.findOneAndUpdate(
        company_code,
        req.body,
        { new: true }
    )

    res.status(201).json({
        "status": res.statusCode,
        "message": "Company data has been updated",
        "data": updatedDetails
    })
})


const deleteCompany = asyncHandler(async (req, res) => {

    const company_code = req.params.company_code
    if (company_code !== req.user.company_code) {
        res.status(401)
        throw new Error(`Comany with id: ${company_code} is either not loggedin or incorrect`)
    }

    const companyToDelete = await CompanyModel.findOneAndDelete(company_code)
    res.status(202).json({
        "status": res.statusCode,
        "message": `Company with id: ${company_code} has been deleted`,
        "data": companyToDelete
    })

})

// Add a recruiter to a company - A recruiter hasn't mentioned in any of the company will not be able to register the platform.
const addRecuriter = asyncHandler(async (req, res) => {

    const recruiter = req.body
    if (!recruiter) {
        res.status(400)
        throw new Error("A body with email and name is required")
    }

    const company_code = req.params.company_code
    if (company_code !== req.user.company_code) {
        res.status(401)
        throw new Error(`Comany with id: ${company_code} is either not loggedin or incorrect`)
    }


    try {
        // Save the new recruiter to the collection
        const companyToAdd = await CompanyModel.findOne({ company_code })
        const recruiterList = companyToAdd.allowedRecruiters.push(recruiter)
        await companyToAdd.save()

        res.status(201).json({
            "status": res.statusCode,
            "message": "A new recruiter has been added",
            "data": recruiter
        })
    } catch (err) {
        res.status(400)
        throw new Error("Unable to add recruiter")
    }
})

module.exports = {
    registerCompany,
    companyLogin,
    companyDetails,
    updateCompanyDetails,
    deleteCompany,
    addRecuriter
}