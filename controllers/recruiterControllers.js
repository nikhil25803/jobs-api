const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const RecruiterModel = require("../models/recruiterModel")
const CompanyModel = require("../models/companyModel")
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken")



const registerRecruiter = asyncHandler(async (req, res) => {
    // Retreiving the user's attributes
    const {
        username,
        name,
        email,
        password,
        confirm_password,
        company_email,
        linkedin_url,
        webiste_link
    } = req.body

    // Cehck if all the required body is passed or not
    if (!name || !username || !email || !password || !confirm_password || !linkedin_url || !company_email) {
        res.status(400);
        throw new Error("All fields are required")
    }

    // Check if password and confirm password matches
    if (password !== confirm_password) {
        res.status(400);
        throw new Error("Password and Confirm Password must match")
    }


    // Check username
    const usernameAvailable = await RecruiterModel.findOne({ username })
    if (usernameAvailable) {
        res.status(400);
        throw new Error(`Recruiter: ${username} is already taken`)
    }

    // Check username
    const recruiterAvailable = await CompanyModel.findOne(
        { email: company_email }
    )
    console.log(recruiterAvailable._id);
    if (!recruiterAvailable) {
        res.status(400);
        throw new Error(`Company is not available. Please enter correct email`)
    }


    const recruiters = recruiterAvailable.recruitersList
    const isAllowed = recruiters.some(element => {
        if (element.email === email) {
            return true;
        }

        return false;
    });


    if (isAllowed === false) {
        res.status(400);
        throw new Error(`Recruiter with email: ${email} is not allowed to join the mentioned company`)
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)


    // Try to upload the file
    try {
        const newRecruiter = await RecruiterModel.create({
            recruiter_id: uuid(),
            username,
            name,
            email,
            password: hashedPassword,
            company_email,
            linkedin_url,
            webiste_link
        })
        res.status(201).json({
            "status": res.statusCode,
            "message": "User has been created sucessfully",
            "data": newRecruiter
        })
    } catch (err) {
        res.status(500)
        throw new Error("Unable to create a new user")
    }
})

const loginRecruiter = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400)
        throw new Error("Both username and password")
    }

    const recruiter = await RecruiterModel.findOne({ username })
    if (recruiter && bcrypt.compare(password, recruiter.password)) {
        const accessToken = jwt.sign({
            recruiter: {
                id: recruiter._id,
                recruiter_id: recruiter.recruiter_id,
                username: recruiter.username,
                email: recruiter.email,
                company_email: recruiter.company_email
            }
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "30m" })
        res.status(200)
            .json({
                "status": res.statusCode,
                "message": `Recruiter: ${recruiter.username} has been LoggedIn`,
                "token": accessToken
            })
    } else {
        res.status(404)
        throw new Error("Unable to login recruiter")
    }
})

const recruiterDetails = asyncHandler(async (req, res) => {
    const username = req.params.username
    if (username === req.user.username) {
        const recruiterInDatabase = await RecruiterModel.findOne({ username })
        if (recruiterInDatabase) {
            res.status(200).json({
                "status": res.statusCode,
                "data": req.user
            })
        } else {
            res.status(404).json({
                "status": res.statusCode,
                "message": "Recruiter is not available"
            })
        }
    } else {
        res.status(500)
        throw new Error("Recruiter is either not loggedin or not available")
    }
})


const updateRecruiter = asyncHandler(async (req, res) => {
    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }

    const updateRecruiter = await RecruiterModel.findOneAndUpdate(
        username,
        req.body,
        { new: true }
    )

    res.status(201).json({
        "status": res.statusCode,
        "message": "User data has been updated",
        "data": updateRecruiter
    })
})

const deleteRecruiter = asyncHandler(async (req, res) => {
    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }

    const recruiterToDelete = await RecruiterModel.findOneAndDelete(username)
    res.status(202).json({
        "status": res.statusCode,
        "message": `Recruiter with username: ${username} has been deleted`
    })
})


module.exports = { registerRecruiter, loginRecruiter, recruiterDetails, updateRecruiter, deleteRecruiter }