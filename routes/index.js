const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)

const mainRoutes = require("./main.routes.js")
router.use("/main", mainRoutes)

const privateRoutes = require("./private.routes.js")
router.use("/private", privateRoutes)

module.exports = router;
