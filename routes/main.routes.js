const router = require("express").Router();

const isLoggedIn = require("../middleware/isLoggedIn.js")


router.get("/", isLoggedIn, (req, res, next) => {
    res.render("secret/main.hbs")
})


module.exports = router

