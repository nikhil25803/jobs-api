const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const CompanyModel = require("../models/companyModel")
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken")



const registerCompany = asyncHandler(async (req, res) => {
    // Retreiving the company's attributes
    const {
        name,
        company_code,
        owner_name,
        email,
        password,
        confirm_password,
        linkedin_url,
        website_link,
    } = req.body


    // Cehck if all the required body is passed or not
    if (!name || !owner_name || !email && !password || !confirm_password || !website_link || !linkedin_url) {
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
        throw new Error(`Username: ${username} is already taken`)
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)


    // Try to upload the file
    try {
        const newCompany = await CompanyModel.create({
            name,
            company_code,
            owner_name,
            email,
            password: hashedPassword,
            linkedin_url,
            website_link,
            allowedRecruiters: [null]
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


const companyLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400)
        throw new Error("Both email and password is required")
    }

    const company = await CompanyModel.findOne({ email })
    if (company && bcrypt.compare(password, company.password)) {
        const accessToken = jwt.sign({
            company: {
                id: company._id,
                company_code: company.company_code,
                owner_name: company.owner_name,
                email: company.email,
                linkedin_url: company.linkedin_url,
                website_link: company.website_link
            }
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "30m" })
        res.status(200).json({
            "status": res.statusCode,
            "message": `Company with id: ${company.company_id} has `,
            "token": accessToken
        })
    }
})


const companyDetails = asyncHandler(async (req, res) => {
    const company_code = req.params.company_code

    if (company_code === req.user.company_code) {
        const comapanyInDatabase = await CompanyModel.findOne({ company_code })
        if (comapanyInDatabase) {
            res.status(200).json({
                "status": res.statusCode,
                "data": req.user
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
    const companyToDelete = await CompanyModel.findOneAndDelete(
        company_code,
    )
    res.status(202).json({
        "status": res.statusCode,
        "message": `Company with id: ${company_code} has been deleted`
    })
})

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
    // console.log(req.user);
    try {
        const companyToAdd = await CompanyModel.findOne({ company_code })
        // console.log(companyToAdd.recruiterList);
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

module.exports = { registerCompany, companyLogin, companyDetails, updateCompanyDetails, deleteCompany, addRecuriter }