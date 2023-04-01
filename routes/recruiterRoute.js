const express = require("express")
const recruiterController = require("../controllers/recruiterControllers")
const recruiterTokenVerification = require("../middlewares/recruiterTokenVerification")

// Defining router for the recruiter
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



/*
Jobs Section
- Create Job
- Update Job
- Delete Job
- Select Applicants
*/

// Create a Job
recruiterRoutes.post("/:username/jobs/create", recruiterTokenVerification, recruiterController.createJob)

// List all the jobs created by a recruiter.
recruiterRoutes.get("/:username/jobs", recruiterTokenVerification, recruiterController.listRecruiterJob)

// Get the list of all the applicants applied to a particular job
recruiterRoutes.get("/:username/:job_code/applicants",recruiterTokenVerification, recruiterController.listApplicants)

// Select an user for a particular job
recruiterRoutes.get("/:username/:job_code/:applicant_username/select", recruiterTokenVerification, recruiterController.selectCandidate)


module.exports = recruiterRoutes;
