const jwt = require("jsonwebtoken");

// Function to verify token entered by a recruiter
function recruiterTokenVerification(req, res, next) {

    // Get the token from the headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, recruiter) => {
        if (err) {
            return res.sendStatus(404)
        }
        req.user = recruiter.recruiter
    })
    next()
}


module.exports = recruiterTokenVerification;