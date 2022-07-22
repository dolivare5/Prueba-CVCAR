import Usuario from "../models/Usuario.js";
import Rol from "../models/Rol.js";

/*
    * Este método (mostrarUsuarios) tiene como objetivo traer el listado de cada uno de los usuarios registrados
    * en la bd y retornar un arreglo en formato json con cada uno de los datos de cada usuario.
*/
const mostrarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        if (!usuarios) {
            return res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "not_found"})
        }
        res.json(usuarios);
    } catch (error) {
        res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (registrar) tiene como objetivo registrar un nuevo usuario. Para ello se recibe un objeto con el
    * modelo establecido en Usuario.js con el password hasheado y las respectivas validaciones. Si no hay ningún
    * problema se procede a enviar una petición de creación de un registro por medio de sequelize a postgresql.
*/
const registrar = async (req, res) => {
    try {
        await Usuario.create(req.body);
        return res.json({msg: "Usuario Creado Correctamente", type: "success"});
    } catch (error) {
        return res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "error"})
    }
}

/*
    * Este método (IniciarSession) recibe un email y un password papa posteriormente validar si tiene permisos
    * y si no hay problemas se procede a la comprobación de password e iniciar session.
 */
const iniciarSession = async (req, res) => {
    // Aquí se captura el email y contraseña que se envían desde una petición post hacia esta función.
    const {email, password} = req.body;

    // Se comprueba si existe un usuario con el email que se recibe.
    const usuario = await Usuario.findOne({where: {email}});

    if (!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message, type: "not found"});
    }

    // Se comprueba que este activo y de esta forma poder controlar el acceso a sistema.
    if (usuario.estado === false) {
        return res.json({
            msg: "El usuario se encuentra deshabilitado, comuníquese con el administrador",
            type: "user_deactivated"
        });
    }
    // Si está activo entonces se verifica que tenga un rol activo
    const rol = await Rol.findByPk(id);
    if (rol.estadoRol === false) {
        return res.json({
                msg: "El usuario se encuentra registrado con un permiso deshabilitado, comuníquese con el administrador",
                type: "rol_deactivated"
            }
        );
    }

    // Si pasa los filtros anteriores se verifica su password y se retorna un json con la información de acceso
    if (await usuario.validarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            rolId: usuario.rolId,
        });
    } else {
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({msg: error.message, type: "password_incorrect"});
    }
};

/*
    * Este método (editarUsuario) tiene como objetivo editar los datos de un usuario. Para ello se recibe un objeto con el
    * modelo establecido en Usuario.js con las respectivas validaciones. Si no hay ningún problema se modifica el objeto
    * con los datos modificados por el usuario y se procede a enviar una petición de edición de un registro
    * por medio de sequelize a postgresql.
*/
const editarUsuario = async (req, res) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        // Se comprueba si existe un usuario con el email que se recibe.
        if (!usuario) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message});
        }
        // Se verifica que tenga un rol activo
        const rol = await Rol.findByPk(id);
        if (rol.estadoRol === false) {
            return res.json({msg: "Este rol se encuentra deshabilitado, comuníquese con el administrador"});
        }

        //Se procede con el proceso de edición del objeto
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.rolId = req.body.rolId;
        // Se modifica el registro en la BD
        await usuario.save();
        res.json({
            msg: "Usuario modificado Correctamente",
            type: "success",
        });
    } catch (error) {
        console.log(error)
        res.json({msg: error, type: "error"});
    }
};

/*
    * Este método (restablecerPasswordUsuario) tiene como objetivo restablecer el password de un usuario. Para ello
    * primero se comprueba que el password anterior sea la correcta y si esto se cumple se procede a hashear el nuevo
    * password y se envía ya hasheado a la bd para que se realize la actualización.
*/
const restablecerPasswordUsuario = async (req, res) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        // Se comprueba si existe un usuario con el email que se recibe.
        if (!usuario) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message});
        }
        // Se comprueba si es correcto o no el password actual
        if (!usuario.validarPassword(req.body.passwordAnterior)) {
            return res.json({msg: 'El password actual es incorrecto'});
        }

        // si  el password es correcto, hashear el nuevo password y se le asigna al objeto.
        usuario.password = usuario.hashPassword(req.body.passwordNueva);
        await usuario.save();
        res.json({
            msg: "Password modificada Correctamente",
            type: "success"
        });
    } catch (error) {
        res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (activarDesactivarUsuario) es el encargado de habilitar o deshabilitar usuarios a través de un campo
    * de estado. Esta forma es mucho más práctica y recomendada que eliminarla de forma permanente de la bd.
*/
const activarDesactivarUsuario = async (req, res) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message, type: "not_found"});
        }

        usuario.estado = !usuario.estado;

        await usuario.save();
        res.json({
            msg: "Estado del Usuario modificado Correctamente", type: "success"
        });
    } catch (error) {
        res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "error"});
    }
};

/*
    * Este método (perfil) recibe como parametro el id del usuario y retorna su información. Este método es ideal
    * cuando se recarga la página y comprobar a través de un jwt si el usuario está autenticado y si o esta
    * traer la información del usuario y evitar que vuelva a iniciar session. Este método simularía ese comportamiento.
*/
const perfil = async (req, res) => {
    const {id} = req.params;
    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            const error = new Error("No Encontrado");
            return res.status(404).json({msg: error.message});
        }

        if (usuario.estado === false) {
            return res.json({msg: "El usuario se encuentra deshabilitado, comuníquese con el administrador"});
        }

        res.json({
            email: usuario.email,
            nombre: usuario.nombre,
            rolId: usuario.rolId,
            estado: usuario.estado
        });
    } catch (error) {
        console.log(error)
        res.json({msg: error})
    }
};

/*
    * Este método tiene como objetivo eliminar usuario de forma permanente de la bd. Para ello se recibe un id como
    * parametro y luego se4 busca en emn lka bd el usuario al que pertenece, si existe entonces se procede con la
    * eliminación del registro. No se recomienda eliminar de la bd de datos si no utilizar una tabla resumen o un campo
    * de estado para habilitar o deshabilitar usuarios.
 */
const eliminarUsuario = async (req, res) => {
    try {
        await Usuario.destroy({
            where: {
                id: req.params.id
            }
        });

        res.json({
            msg: "Usuario Eliminado Correctamente",
            type: "success"
        });

    } catch (error) {
        res.json({msg: "Ha ocurrido un error, inténtelo más tarde", type: "error"})
    }
};


export {
    registrar, iniciarSession, perfil, mostrarUsuarios, editarUsuario,
    restablecerPasswordUsuario, activarDesactivarUsuario, eliminarUsuario
};