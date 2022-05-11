const router = require("express").Router();
const UserModel = require("../models/User.model.js")
const bcryptjs = require("bcryptjs");
const { trusted } = require("mongoose");



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


// --ruta get acceder (login)
router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs")
})

// --ruta post acceder (login)

router.post("/login", async (req, res, next) => {

    const {username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Rellena todos los campos"
        })
        return;
    }

    try {

        //validar que el usuario existe en mi DB
        const foundUser = await UserModel.findOne({username: username})
        if (foundUser === null) {
            res.render("auth/login", {
                errorMessage: "El usuario no esta registrado"
            })
            return;
        }
    
        // validar la password que nos da
        const passwordCheck = await bcryptjs.compare(password, foundUser.password)
        if (!passwordCheck) {

            // si la password es mala, otra vez al login
            res.render("auth/login", {
                errorMessage: "Contraseña invalida"
            })
            return;
        }

        // le creamos una sesion activa al usuario
        req.session.user = foundUser;

        // booleano que comprueba que el usuario esta en la sesion
        req.app.locals.userIsActive = true;

        // una vez cumplido todo lo anterior, podemos redirigir al usuario a su perfil
        res.redirect("/main")

    } catch(err) {
        next (err)
    }

})

// POST "/auth/logout" => cerrar la sesion del usuario
router.post("/logout", (req, res, next) => {

    // 1 cerrar sesion
    req.session.destroy()
    req.app.locals.userIsActive = false;


    // 2 redireccionar al usuario
    res.redirect("/")


})






module.exports = router;