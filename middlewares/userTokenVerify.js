const jwt = require("jsonwebtoken");

// Function to verify token entered by a user
function authenticateToken(req, res, next) {

    // Get the bearer token from the headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user,) => {
        if (err) {
            return res.sendStatus(404)
        }
        req.user = user.user
    })
    next()
}


module.exports = authenticateToken;