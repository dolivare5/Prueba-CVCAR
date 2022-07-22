import Rol from "../models/Rol.js";

/*
    * Este método (registrarRol) tiene como objetivo registrar un nuevo Rol. Para ello se recibe un objeto con el
    * modelo establecido en Rol.js con las respectivas validaciones. Si no hay ningún.
    * problema se procede a enviar una petición de creación de un registro por medio de sequelize a postgresql.
*/
const registrarRol = async (req, res) => {
    try {
        await Rol.create(req.body);
        res.json({
            msg: "Rol Creado Correctamente",
            type: "success"
        });
    } catch (error) {
        res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (mostrarRoles) tiene como objetivo traer el listado de roles registrados
    * en la bd y retornar un arreglo en formato json con cada uno de los datos de cada rol.
*/
const mostrarRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        return res.json(roles);
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (mostrarRole) tiene como objetivo traer el rol que tenga el id que se recibe y retornar dicho rol si
    * en forma de objeto si existe en la bd.
*/
const mostrarRol = async (req, res) => {
    const {id} = req.params;
    try {
        // Se busca el rol que tenga registrado el id que se recibe como parametro
        const rol = await Rol.findByPk(id);

        // Si no se encuentra manda un mensaje de error, de lo contrario retorna un objeto con la información
        if (!rol) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message, type: "not_found"});
        }

        return res.json(rol);
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (editarRol) tiene como objetivo editar los datos de un rol. Para ello se recibe un objeto con el
    * modelo establecido en Rol.js con las respectivas validaciones. Si no hay ningún problema se modifica el objeto
    * con los datos modificados por el usuario y se procede a enviar una petición de edición de un registro
    * por medio de sequelize a postgresql.
*/
const editarRol = async (req, res) => {
    const {id} = req.params;
    try {
        // Se extrae en un objeto la información del rol que tenga registrado el id que se recibe como parametro.
        const rol = await Rol.findByPk(id);
        // Si no existe se manda un error, de lo contrario se procede a editar.
        if (!rol) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message, type: "not_found"});
        }
        // Se actualiza el registro en la BD
        rol.nombreRol = req.body.nombreRol;
        await rol.save();
        // Se retorna un json con un mensaje de éxito.
        return res.json({
            msg: "Rol modificado Correctamente",
            type: "success",
        });
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (activarDesactivarRol) es el encargado de habilitar o deshabilitar roles a través de un campo
    * de estado. Esta forma es mucho más práctica y recomendada que eliminarla de forma permanente de la bd.
*/
const activarDesactivarRol = async (req, res) => {
    const {id} = req.params;
    try {
        const rol = await Rol.findByPk(id);

        if (!rol) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message});
        }
        rol.estadoRol = !rol.estadoRol;

        await rol.save();
        res.json({
            msg: "Estado del Rol modificado Correctamente",
            type: "success"
        });
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método tiene como objetivo eliminar un rol de forma permanente de la bd. Para ello se recibe el id como
    * parametro y luego se busca en emn lka bd el rol al que pertenece, si existe entonces se procede con la
    * eliminación del registro. No se recomienda eliminar de la bd de datos si no utilizar una tabla resumen o un campo
    * de estado para habilitar o deshabilitar usuarios.
 */
const eliminarRol = async (req, res) => {

    try {
        await Rol.destroy({
            where: {
                id: req.params.id
            }
        });

        res.json({
            msg: "Rol Eliminado Correctamente",
            type: "success"
        });
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error. Inténtelo más tarde", type: "error"});
    }
}

export {registrarRol, mostrarRoles, editarRol, eliminarRol, mostrarRol, activarDesactivarRol};