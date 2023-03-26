const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const S3Upload = require("../config/s3Service")
const UserModel = require("../models/usersModel")
const uuid = require("uuid").v4;



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
            user_id: uuid(),
            username,
            email,
            password: hashedPassword,
            github_url,
            linkedin_url,
            resume_link: result
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


module.exports = { registerUser }