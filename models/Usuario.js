// Sequelize es un ORM que permite acelerar el proceso de desarrollo en la ejecución de operaciones CRUD.
import {sequelize} from "../config/db.js";
// Para poder utilizar el tipado de datos en sequelize es necesario importar DataTypes
import {DataTypes} from "sequelize";
// Bcrypt es una librería que permite encriptar y desencriptar password.
import bcrypt from "bcrypt";

// Creación de la estructura de los datos para los usuarios con sus respectivas validaciones
const Usuario = sequelize.define(
    'Usuarios', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'nombre es obligatorio y no puede ir vacio'
                }
            }
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            validate: {
                isEmail: {msg: 'Ingrese un correo valido'}
            },
            unique: {
                args: true,
                msg: "Usuario ya registrado"
            }
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'El password es obligatorio y no puede ir vacio'
                }
            }
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        // Antes de crear un objeto con los datos definidos anteriormente se encripta el password.
        hooks: {
            beforeCreate(usuario) {
                usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(12), null);
            }
        }
    }
);


// Método para comparar los password
Usuario.prototype.validarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// Método pa encriptar password.
Usuario.prototype.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
}
export default Usuario;
