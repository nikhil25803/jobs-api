const express = require("express")
const recruiterController = require("../controllers/recruiterControllers")
const recruiterTokenVerification = require("../middlewares/recruiterTokenVerification")

const recruiterRoutes = express.Router()

// Register as a new recruiter
recruiterRoutes.post('/register', recruiterController.registerRecruiter)

// Login as the recruiter
recruiterRoutes.post('/login', recruiterController.loginRecruiter)


// Get details of the loggedinRecruiter
recruiterRoutes.get('/:username', recruiterTokenVerification, recruiterController.recruiterDetails)


// Update a recruiter by username
recruiterRoutes.put('/:username/update', recruiterTokenVerification, recruiterController.updateRecruiter)


// Delete a recruiter by username
recruiterRoutes.delete('/:username/delete', recruiterTokenVerification, recruiterController.deleteRecruiter)


module.exports = recruiterRoutes;
