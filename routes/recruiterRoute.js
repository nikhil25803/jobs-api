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


/*

Jobs Section
- Create Job
- Update Job
- Delete Job
- Select Applicants

*/


recruiterRoutes.post("/:username/jobs/create", recruiterTokenVerification, recruiterController.createJob)


/*

Jobs Selection Section
- Check the Jobs created by the user
- Check the users applied to a sepcific job
- Select one user for a job

*/

recruiterRoutes.get("/:username/jobs", recruiterTokenVerification, recruiterController.listRecruiterJob)
recruiterRoutes.get("/:username/:job_code")
recruiterRoutes.get("/:username/:job_code/applicants")
recruiterRoutes.get("/:username/:job_code/:email/select")


module.exports = recruiterRoutes;
