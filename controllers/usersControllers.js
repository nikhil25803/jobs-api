const bcrypt = require("bcrypt")
const asyncHandler = require("express-async-handler")
const S3Upload = require("../config/s3Service")
const UserModel = require("../models/usersModel")
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken")



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
                resume_link: user.resume_link
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
                "data": req.user
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
    console.log(req.user);
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
        "message": `User with username: ${username} has been deleted`
    })
})


module.exports = { registerUser, loginUser, userDetails, updateUser, deleteUser }