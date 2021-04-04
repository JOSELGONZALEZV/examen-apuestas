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
    const resultados = await Oferta.findAll({
        include:[{model: User}],
        order:[['valorOferta', 'DESC']]
    });
    const usuarios = await User.findAll({
        include:[{model: Oferta}],
    });

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("usuariopro.ejs",{errors, mensajes, resultados, usuarios })
});


router.get("/resultado", [checkLogin], async (req,res) => {

    const resultados = await Oferta.findAll({
        include:[{model: User}],
         order:[['valorOferta', 'DESC']]
        
    });

    const usuarios = await User.findAll({
        include:[{model: Oferta}],
    });

    const avion = resultados.filter(x=> x.producto==1);
    const auto = resultados.filter(x=> x.producto==2);
    const mansion = resultados.filter(x=> x.producto==3);

    if(avion.lenght == 0 || auto.lenght == 0 || mansion.length == 0){
        req.flash('errors', "existen productos que no tienen oferta.");
        return res.redirect('/');
    }
 

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    Oferta.destroy({
        where: {},
        truncate: true
        });

    res.render("resultado.ejs",{ errors, mensajes, resultados, usuarios });
    
    
    
    
});



//ruta para guardar los mensaje en la base de dato por id de user en session
router.post('/rematar', [checkLogin ], async (req,res) => {

    //const user = await User.findOne({id: req.session.user.id});
   

    if(req.body.valorOferta == ""){
        req.flash('errors', "ingresar una oferta");
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
