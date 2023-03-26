const UserSchema = require("../models/usersModel")
const bcrypt = require("bcrypt")
const { model } = require("mongoose")
const asyncHandler = require("express-async-handler")
const S3Upload = require("../config/s3Service")

const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const file = req.files[0]
    const result = await S3Upload.s3Uploadv3(file)
    res.status(200).json({
        "status": res.statusCode,
        "message": result
    })
})


module.exports = { registerUser }