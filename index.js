const express = require("express")
const dotenv = require("dotenv")
const ConnectDB = require("./config/databse")

// Load .env 
dotenv.config()

// Databse Connection
ConnectDB()


// Initialising an express instance
const app = express()


// Middlewares
app.use(express.json())


// Home route (ping test)
app.get('/', (req, res) => {
    res.status(200).json({
        "status":res.statusCode,
        "message":"Server is up and running"
    })
})


// Define a PORT
const PORT = process.env.PORT || 3000

// Start and listen to the server
app.listen(PORT, () => {
    console.log(`Server is running on port: https://localhost:${PORT}`);
})