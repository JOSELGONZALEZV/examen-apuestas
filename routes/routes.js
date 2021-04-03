const { Router } = require('express');
const { User, Oferta } = require('../db');
const router = Router();

// aca configuramos las rutas.
function checkLogin(req, res, next) {

    
    if (req.session.user == null){
        req.flash('errors', "Tienes que estar registrado para ingresar al sistema.");
        return res.redirect('/login');
    }

    res.locals.user = req.session.user;

    next();
}

//qui enviamos la informacion de la base de datos para mostrar 
router.get("/", [checkLogin ] , async (req,res) => {
    const ofertaUsuario = await Oferta.findAll({
        include:[{model: User}]
    });


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("usuariopro.ejs",{errors, mensajes, ofertaUsuario })
});


router.get("/oferta", [checkLogin], (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("oferta.ejs",{ errors, mensajes })
});

router.get("/newpag2", [checkLogin], (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("newpag2.ejs",{ errors, mensajes })
});

//ruta para guardar los mensaje en la base de dato por id de user en session
router.post('/rematar', [checkLogin ], async (req,res) => {

    //const user = await User.findOne({id: req.session.user.id});
   

    if(req.body.valorOferta == ""){
        req.flash('errors', "ingresar un numero de 9 digitos");
        return res.redirect('/rematar');
    }
    else{
            await Oferta.create({
                valorOferta: req.body.valorOferta,
                producto: req.body.producto,
                UserId:req.session.user.id
            });

        }
        req.flash("mensajes", "oferta ingresada y almacenados correctamente en la base de datos.");
        res.redirect("/");
    });
 
    
    
    



module.exports = router;
