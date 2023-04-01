const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const RecruiterModel = require("../models/recruiterModel")
const CompanyModel = require("../models/companyModel")
const jwt = require("jsonwebtoken")
const JobsModel = require("../models/jobsModel")
const UserModel = require("../models/usersModel")



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
        website_link
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
    if (!recruiterAvailable) {
        res.status(400);
        throw new Error(`Company is not available. Please enter correct email`)
    }

    function search(nameKey, myArray) {
        for (let i = 1; i < myArray.length; i++) {
            if (myArray[i].email === nameKey) {
                return myArray[i];
            }
        }
        return null;
    }

    const recruiters = recruiterAvailable.allowedRecruiters
    const resultObject = search(email, recruiters);
    if (resultObject === null) {
        res.status(400);
        throw new Error(`Recruiter with email: ${email} is not allowed to join the mentioned company`)
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Try to upload the file
    try {
        const newRecruiter = await RecruiterModel.create({
            company_email: recruiterAvailable.email,
            company_code: recruiterAvailable.company_code,
            username,
            name,
            email,
            password: hashedPassword,
            linkedin_url,
            website_link
        })
        res.status(201).json({
            "status": res.statusCode,
            "message": "Recruiter has been created sucessfully",
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
        { username: req.user.username },
        req.body,
        { new: true }
    )
    // console.log(updateRecruiter);
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
        "message": `Recruiter with username: ${username} has been deleted`,
        "data": recruiterToDelete
    })
})


const createJob = asyncHandler(async (req, res) => {

    // Accepting request body
    const {
        title,
        role,
        description,
        paid,
        stipend
    } = req.body


    // Cehck if all the required body is passed or not
    if (!title || !role || !description || !paid || !stipend) {
        res.status(400);
        throw new Error("All fields are required")
    }


    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }


    // Check company
    const companyAvailable = await CompanyModel.findOne(
        { email: req.user.company_email }
    )
    if (!companyAvailable) {
        res.status(400);
        throw new Error(`Company is not available. Please enter correct email`)
    }
    try {
        const newJob = await JobsModel.create({
            company_email: req.user.company_email,
            company_name: companyAvailable.name,
            company_website: companyAvailable.website_link,
            company_linkedin: companyAvailable.linkedin_url,
            job_code: `${companyAvailable.company_code}${Math.floor(Math.random() * 90000) + 10000}`,
            title,
            role,
            description,
            paid,
            stipend,
            recruiter: req.user.id,
            appliedBy: [null],
            selectedCandidates: [null]
        })

        // Populate recruiter field
        const recruiter = await RecruiterModel.findOne({ _id: req.user.id })
        const jobsPostedList = recruiter.jobsPosted.push(newJob)
        await recruiter.save()

        // Populate company field
        const company = await CompanyModel.findOne({ email: req.user.company_email })
        const companyListedJobs = company.jobsListed.push(newJob)
        await company.save()

        // Send response message
        res.status(201).json({
            "status": res.statusCode,
            "message": "New Job has been created sucessfully",
            "data": newJob
        })

    } catch (err) {
        res.status(500)
        throw new Error("Unable to create a new job")
    }
})

const listRecruiterJob = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }

    const jobsListed = await RecruiterModel.findOne({ username: req.user.username })

    // Fetch the object id and return the data corresponding to it.
    const jobsPosted = jobsListed.jobsPosted
    let jobsCreated = []
    for (let i = 0; i < jobsPosted.length; i++) {
        let id = jobsPosted[i]
        const job = await JobsModel.findById({ _id: id })
        if (job) {
            jobsCreated.push(job)
        }
    }

    res.status(200).json({
        status: res.statusCode,
        data: jobsCreated
    })
})

const listApplicants = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }

    const job_code = req.params.job_code
    try {
        const job = await JobsModel.findOne(
            { job_code }
        )

        const applicants = job.appliedBy
        res.status(200).json({
            status: res.statusCode,
            data: applicants
        })
    } catch (err) {
        res.status(500)
        throw new Error("Couldnt fetch the jobs created by the recruiter")
    }
})


const selectCandidate = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Recruiter: ${username} is either not loggedin or incorrect`)
    }


    const job_code = req.params.job_code
    const job = await JobsModel.findOne({ job_code })
    if (!job) {
        res.status(500)
        throw new Error(`Job with id: ${job_code} is not accesible now`)
    }


    const applicant_username = req.params.applicant_username
    const user = await UserModel.findOne({ username: applicant_username })
    if (!user) {
        res.status(500)
        throw new Error(`User with username: ${username} is not available`)
    }

    const selectedCandidatesDetails = {
        "name": user.name,
        "email": user.email,
        "resume_link": user.resume_link
    }

    try {
        // Populate the `selectedCandidates` field of the job's collection
        job.selectedCandidates.push(selectedCandidatesDetails)
        await job.save()

        // Populat the `selectedAt` field of user's collection
        user.selectedAt.push({
            "job_code": job.job_code,
            "company_name": job.company_name,
            "company_email": job.company_email,
            "recruiter_email": req.user.email
        })
        await user.save()

        res.status(200).json({
            status: res.statusCode,
            message: `${username} has been selected for this job`
        })
    } catch (err) {
        res.status(500)
        throw new Error("Faced issue while selecting the applicant")
    }

})


module.exports = {
    registerRecruiter,
    loginRecruiter,
    recruiterDetails,
    updateRecruiter,
    deleteRecruiter,
    createJob,
    listRecruiterJob,
    listApplicants,
    selectCandidate
}