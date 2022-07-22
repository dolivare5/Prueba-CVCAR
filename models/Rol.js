// Sequelize es un ORM que permite acelerar el proceso de desarrollo en la ejecución de operaciones CRUD.
import {sequelize} from "../config/db.js";
// Para poder utilizar el tipado de datos en sequelize es necesario importar DataTypes
import {DataTypes} from "sequelize";

import Usuario from "./Usuario.js";
// Definición de la estructura de datos para cada rol con sus respectivas validaciones.
const Rol = sequelize.define(
    'Roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombreRol: {
            type: DataTypes.STRING(60),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'nombre es obligatorio y no puede ir vacio'
                }
            }
        },
        estadoRol: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    }
);

// Uniones

// Un rol tiene asignado muchos usuarios
Rol.hasMany(Usuario, {
    foreignKey: 'rolId',
    sourceKey: 'id'
});

Usuario.belongsTo(Rol, {
    foreignKey: 'rolId',
    targetId: 'id'
})

export default Rol;
