const jwt = require("jsonwebtoken");


// Function to verify token entered by a company
function companyTokenVerification(req, res, next) {

    // Get the headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, comapany) => {
        if (err) {
            return res.sendStatus(404)
        }
        req.user = comapany.company
    })
    next()
}


module.exports = companyTokenVerification;