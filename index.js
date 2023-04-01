const express = require("express")
const dotenv = require("dotenv")
const ConnectDB = require("./config/databse")
const bodyparser = require("body-parser")
const userRoutes = require("./routes/usersRoute")
const companyRoutes = require("./routes/companyRoute")
const recruiterRoutes = require("./routes/recruiterRoute")
const jobsRoutes = require("./routes/jobsRoute")
const errorHandler = require("./middlewares/errorHandler")

// Load .env 
dotenv.config()


// Databse Connection
ConnectDB()


// Initialising an express instance
const app = express()


// Middlewares
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


// Home route (ping test)
app.get('/', (req, res) => {
    res.status(200).json({
        "status": res.statusCode,
        "message": "Server is up and running"
    })
})

// Routes
app.use('/jobs', jobsRoutes)
app.use('/user', userRoutes)
app.use('/company', companyRoutes)
app.use('/recruiter', recruiterRoutes)

// Middleware to handle error thrown by an endpoint.
app.use(errorHandler)


// Define a PORT
const PORT = process.env.PORT || 3000

// Start and listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on port: https://localhost:${PORT}`);
})