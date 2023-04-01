const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Retreive credentials from the .env file
dotenv.config()
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

// Define the URL to connect to the Atlas.
const MongoURL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@jobsapi.intflkm.mongodb.net/?retryWrites=true&w=majority`

// Function to establis a connection
const ConnectDB = async () => {
    try {
        const connect = await mongoose.connect(MongoURL)
        console.log("Databse Connected.", connect.connection.name, connect.connection.host);
    } catch (err) {
        console.log("Failed to connect with database", err);
        process.exit(1)
    }
}

module.exports = ConnectDB