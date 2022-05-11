const router = require("express").Router();
const UserModel = require("../models/User.model.js")
const bcryptjs = require("bcryptjs");



// Aqui nuestras rutas

// --ruta get registro
router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs")
})

// --ruta post registro
router.post("/signup", async (req, res, next) => {

    const { username, password } = req.body

    //VALIDAR SI LA INFO ESTA COMPLETA
    if (!username || !password) {
        res.render("auth/signup", {
            errorMessage: "Completa los campos"
        })
        return;
    }

    //VALIDAR QUE USER SEA UNICO EN MI DB

    try {

        //checkear que el username no existe
        const foundUser = await UserModel.findOne({username:username})
        if (foundUser !== null ) {
            res.render("auth/signup", {
                errorMessage: "El usuario ya existe"
            })
            return;
        }

        //preparar el cifrado de la pass
        const salt = await bcryptjs.genSalt(12)
        const hashPassword = await bcryptjs.hash(password, salt)

        //Crear el usuario
        const createdUser = await UserModel.create({
            username, 
            password: hashPassword

        })
    } catch(err) {
        next(err)
    }
    
    // una vez creado el usuario, lo mandamos a la pagina de log in
    res.redirect("/auth/login")


})








module.exports = router;