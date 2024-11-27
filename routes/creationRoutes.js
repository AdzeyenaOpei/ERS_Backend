const express = require("express")
const router = express.Router()
const {addData} = require("../controllers/creationController")

router.post("addData",addData)

module.exports = router