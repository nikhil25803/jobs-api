const express = require("express")
const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT || 3000



const app = express()

app.get('/', (req, res) => {
    res.status(200).json({
        "status":res.statusCode,
        "message":"Server is up and running"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port: https://localhost:${PORT}`);
})