const Sequelize = require('sequelize');
const { Model, DataTypes, Deferrable } = require("sequelize");
const clave = require('./secret')
const moment =require('moment');

// acá creamos la conexión a la Base de Datos
const sql = new Sequelize('db_subasta', 'root', clave.clave, {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sql.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Debe indicar un nombre'
            },
            len: {
                args: [3],
                msg: 'El nombre debe ser de largo al menos 2'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Debe indicar un email'
            },
            len: {
                args: [3],
                msg: 'El email debe ser de largo al menos 3'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar una contraseña'
            },
            len: {
                args: [3],
                msg: 'La contraseña debe ser de largo al menos 3'
            },
        }
    }
}, {timetamps: true});

const Oferta = sql.define('Oferta', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valorOferta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {  
            msg: 'debe ingresar un nombre',
            }           
        }
    },
    producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notNull: {  
            msg: 'debe ingresar un valor',
            }            
        }
    },

}, {timetamps: true});



//  después sincronizamos nuestro código con la base de datos
sql.sync()
    .then(() => {
        console.log('Tablas creadas (SI NO EXISTEN) ...');
});
//relacion uno a mucho
    User.hasMany(Oferta);
    Oferta.belongsTo(User);
   


// finalmente acá listamos todos los modelos que queremos exportar
module.exports = {
    User, Oferta
};