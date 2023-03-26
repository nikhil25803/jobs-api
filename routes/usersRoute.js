const express = require("express")
const userControllers = require("../controllers/usersControllers")
const usersRoute = express.Router()

const multer = require("multer")


const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10000000000, files: 1 }
})


usersRoute.post('/', upload.array("files"), userControllers.registerUser)

usersRoute.post('/test', (req, res) => {
    res.json({
        "status": res.statusCode,
        "data": req.body
    })
})


module.exports = usersRoute;