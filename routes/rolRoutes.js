import express from "express";
import {
    activarDesactivarRol,
    editarRol,
    eliminarRol,
    mostrarRol,
    mostrarRoles,
    registrarRol
} from "../controllers/RolController.js";

const router = express.Router();

router.post("/registrar-rol", registrarRol);
router.get("/mostrar-roles", mostrarRoles);
router.get("/mostrar-rol/:id", mostrarRol);
router.delete('/eliminar/:id', eliminarRol);
router.put("/editar/:id", editarRol);
router.put("/editar-estado-rol/:id", activarDesactivarRol);

export default router;