const express = require("express")
const jobsController = require("../controllers/jobsController")

// Defining router for the Jobs
const jobRoutes = express.Router()

// Fetch all the jobs listed on the platform
jobRoutes.get("/all", jobsController.listJobs)

module.exports = jobRoutes