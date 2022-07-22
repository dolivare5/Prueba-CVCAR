import {sequelize} from "./config/db.js";
import express from 'express';
// Dotenv me permite acceder a los archivos .env y las variables de entorno
import dotenv from 'dotenv'
import usuarioRoutes from "./routes/usuarioRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";


async function main() {
    try {
        const app = express();
        app.use(express.json());
        await sequelize.sync()
            .then(() => console.log('BD Conectada'))
            .catch(err => console.error(err))
        ;

        dotenv.config();

        app.use("/api/usuarios", usuarioRoutes);
        app.use("/api/roles", rolRoutes);

        const port = process.env.PORT || 4000;

        app.listen(port);

        console.log(`Servidor corriendo en el puerto ${port}`)
    } catch (e) {
        console.log(e)
    }
}

await main();