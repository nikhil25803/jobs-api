const express = require("express")
const userControllers = require("../controllers/usersControllers")
const usersRoute = express.Router()
const multer = require("multer")
const authenticateToken = require("../middlewares/userTokenVerify")


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

// Create a new user
usersRoute.post('/register', upload.array("resume"), userControllers.registerUser)

// Login the user
usersRoute.post('/login', userControllers.loginUser)


// Get details of current user
usersRoute.get('/:username', authenticateToken, userControllers.userDetails)


// Update a user by username
usersRoute.put('/:username/update', authenticateToken, userControllers.updateUser)


// Delete a user by username
usersRoute.delete('/:username/delete', authenticateToken, userControllers.deleteUser)


// Get all jobs as an existing user
usersRoute.get("/:username/jobs", authenticateToken, userControllers.listJobs)


// Apply to a job
usersRoute.get("/:username/:job_code/apply", authenticateToken, userControllers.applyToAJob)


module.exports = usersRoute;
