const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const S3Upload = require("../config/s3Service")
const UserModel = require("../models/usersModel")
const jwt = require("jsonwebtoken")
const JobsModel = require("../models/jobsModel")



const registerUser = asyncHandler(async (req, res) => {
    // Retreiving the user's attributes
    const {
        name,
        username,
        email,
        password,
        confirm_password,
        github_url,
        linkedin_url
    } = req.body

    // Cehck if all the required body is passed or not
    if (!name || !username || !email && !password || !confirm_password || !github_url || !linkedin_url) {
        res.status(400);
        throw new Error("All fields are required")
    }

    // Check if password and confirm password matches
    if (password !== confirm_password) {
        res.status(400);
        throw new Error("Password and Confirm Password must match")
    }


    // Check username
    const userAvailable = await UserModel.findOne({ username })
    if (userAvailable) {
        res.status(400);
        throw new Error(`Username: ${username} is already taken`)
    }

    // Check username
    const emailAvailable = await UserModel.findOne({ email })
    if (emailAvailable) {
        res.status(400);
        throw new Error(`Email: ${email} is already registered`)
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)


    // Try to upload the file
    try {
        const file = req.files[0]
        const result = await S3Upload.s3Uploadv3(file)
        const newUser = await UserModel.create({
            username,
            name,
            email,
            password: hashedPassword,
            github_url,
            linkedin_url,
            resume_link: result,
            appliedAt: [null],
            selectedAt: [null]
        })
        res.status(201).json({
            "status": res.statusCode,
            "message": "User has been created sucessfully",
            "data": newUser
        })
    } catch (err) {
        res.status(500)
        throw new Error("Unable to create a new user")
    }
})


const loginUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body
    if (!username || !password) {
        res.status(400)
        throw new Error("Both username and password")
    }

    const user = await UserModel.findOne({ username })
    if (user && bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                github_url: user.github_url,
                linkedin_url: user.linkedin_url,
                resume_link: user.resume_link,
                appliedAt: user.appliedAt,
                selectedAt: user.selectedAt
            }
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "30m" })
        res.status(200)
            .json({
                "status": res.statusCode,
                "message": `User: ${username} has been LoggedIn`,
                "token": accessToken
            })
    } else {
        res.status(404)
        throw new Error("Unable to login user")
    }
})

const userDetails = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username === req.user.username) {

        const userInDatabase = await UserModel.findOne({ username })
        if (userInDatabase) {
            res.status(200).json({
                "status": res.statusCode,
                "message": "Loggedin user's data has been fetched",
                "data": userInDatabase
            })

        } else {

            res.status(404).json({
                "status": res.statusCode,
                "message": "User is not available"
            })

        }
    } else {
        res.status(500)
        throw new Error("User is either not loggedin or not available")
    }
})


const updateUser = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Username: ${username} is either not loggedin or incorrect`)
    }

    const updatedUser = await UserModel.findOneAndUpdate(
        username,
        req.body,
        { new: true }
    )

    res.status(201).json({
        "status": res.statusCode,
        "message": "User data has been updated",
        "data": updatedUser
    })

})


const deleteUser = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Username: ${username} is either not loggedin or incorrect`)
    }

    const userToDelete = await UserModel.findOneAndDelete(username)
    res.status(202).json({
        "status": res.statusCode,
        "message": `User with username: ${username} has been deleted`,
        "data": userToDelete,
    })

})

const listJobs = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Username: ${username} is either not loggedin or incorrect`)
    }

    try {
        const data = await JobsModel.find({}, {
            appliedBy: 0,
            selectedCandidates: 0,
        }
        );

        res.status(200).json({
            "status": res.statusCode,
            "data": data
        })
    } catch (err) {
        res.status(500)
        throw new Error("Couldn't fetch jobs")
    }
})


const applyToAJob = asyncHandler(async (req, res) => {

    const username = req.params.username
    if (username !== req.user.username) {
        res.status(401)
        throw new Error(`Username: ${username} is either not loggedin or incorrect`)
    }

    const job_code = req.params.job_code
    const jobAvailable = await JobsModel.findOne({ job_code })
    if (!jobAvailable) {
        res.status(404)
        throw new Error(`Job with id: ${job_code} not available`)
    }


    const userAvailable = await UserModel.findOne({ username })
    if (!userAvailable) {
        res.status(404)
        throw new Error(`User with username: ${username} not available`)
    }

    function search(nameKey, myArray) {
        for (let i = 1; i < myArray.length; i++) {
            if (myArray[i].email === nameKey) {
                return 1;
            }
        }
        return 0;
    }

    const appliedCandidateList = jobAvailable.appliedBy
    const resultObject = search(req.user.email, appliedCandidateList);

    if (resultObject === 1) {
        res.status(400);
        throw new Error(`User with email: ${req.user.email} has already applied for this job`)
    }

    try {
        // Push user's data to the `appledBy` section of the user's collection
        const userData = {
            "name": req.user.name,
            "username": username,
            "email": req.user.email,
            "resume_link": req.user.resume_link
        }
        jobAvailable.appliedBy.push(userData)
        await jobAvailable.save()

        // Populate the `appliedAt` section of the user's collection
        const appliedAtData = {
            "company_name": jobAvailable.company_name,
            "company_email": jobAvailable.company_email,
            "job_code": jobAvailable.job_code,
        }
        userAvailable.appliedAt.push(appliedAtData)
        await userAvailable.save()

        res.status(200).json({
            "status": res.statusCode,
            "message": `Sucessfully applied for the job code ${job_code}`,
            "data": appliedAtData
        })
    } catch (err) {
        res.status(500)
        throw new Error("Not able to apply for this Job")
    }
})


module.exports = {
    registerUser,
    loginUser,
    userDetails,
    updateUser,
    deleteUser,
    listJobs,
    applyToAJob
}