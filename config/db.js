/*
    *Utilizo sequelize, ya que al ser un ORM permite acelerar el desarrollo de la aplicación evitando la escritura
    * repetitiva de código para ejecutar operaciones CRUD. Además, porque el rendimiento de las consultas no es crítico,
    * podremos confiar en el ORM para interactuar con el RDBMS sin dedicar mucho tiempo a supervisar las acciones ejecutadas.
*/

import {Sequelize} from "sequelize";
import dotenv from 'dotenv'

dotenv.config();
export const sequelize = new Sequelize(
    'Usuarios',
    process.env.USERNAME_BD,
    process.env.PASSWORD_BD,
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
        logging: false

    },
);