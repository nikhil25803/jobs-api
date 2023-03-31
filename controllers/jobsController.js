const asynchandler = require("express-async-handler")
const JobsModel = require("../models/jobsModel")


const listJobs = asynchandler(async (req, res) => {
    try {

        const data = await JobsModel.find(
            {},
            {
                appliedBy: 0
            }
        );


        res.status(200).json({
            "status": res.statusCode,
            "data": data
        })
    } catch (err) {
        res.status(500)
        throw new Error("Couldn't fetch jobs")
    }
})



module.exports = {
    listJobs
}