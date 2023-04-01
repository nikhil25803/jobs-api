const express = require("express")
const companyController = require("../controllers/companyController")
const companyTokenVerification = require("../middlewares/companyTokenVerification")

// Defining router for company
const companyRoute = express.Router()


// Create a new comapny
companyRoute.post('/register', companyController.registerCompany)

// Login to the company profile
companyRoute.post('/login', companyController.companyLogin)

// Get details of loggedIn company
companyRoute.get('/:company_code', companyTokenVerification, companyController.companyDetails)

// Update a company details by company_id
companyRoute.put('/:company_code/update', companyTokenVerification, companyController.updateCompanyDetails)

// Delete a company by company id
companyRoute.delete('/:company_code/delete', companyTokenVerification, companyController.deleteCompany)


/*
Defining company's route to handle function related to a recruiter of the company
- Adding a recruiter
- Updating the field of a recruiter
- Delete a recruiter from the `allowedRecruiters` section
*/

// Add a new recruiter to the list
companyRoute.put('/:company_code/recruiter/add', companyTokenVerification, companyController.addRecuriter)


module.exports = companyRoute;
