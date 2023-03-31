const express = require("express")
const jobsController = require("../controllers/jobsController")
const jobRoutes = express.Router()

jobRoutes.get("/all", jobsController.listJobs)

module.exports = jobRoutes