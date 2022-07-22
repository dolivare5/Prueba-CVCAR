import express from "express";
import {
    activarDesactivarUsuario,
    editarUsuario,
    eliminarUsuario,
    iniciarSession,
    mostrarUsuarios,
    perfil,
    registrar,
    restablecerPasswordUsuario,
} from "../controllers/usuarioController.js";

const router = express.Router();

// Estas son las rutas para mostrar, registrar, eliminar y Editar Usuario. También incluye inicio de session,
// restablecimiento de password, cambio de estado y mostrar perfil
router.get('/todos-los-usuarios', mostrarUsuarios)
router.post("/registrar", registrar); // Crea un nuevo usuario
router.post("/login", iniciarSession);
router.put('/editar-usuario/:id', editarUsuario);
router.put('/restablecer-password/:id', restablecerPasswordUsuario);
router.put('/cambiar-estado/:id', activarDesactivarUsuario);
router.delete('/eliminar-usuario/:id', eliminarUsuario);

router.get("/perfil-de-usuario/:id", perfil);

export default router;