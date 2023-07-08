import { clientes } from '../../models/clientes.js'
import { usuarios } from '../../models/usuarios.js';
import { letrasMayusculas } from './helpers.js';
import multer from 'multer';
import path from 'path'
import { enviarMail } from '../Mensajes.js';

import {
    verificarNombre,
    verificarCedula,
    verificarEstado,
    verificarExtensionFoto,
    verificarGenero,

} from './rules.js'



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/clientes')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
export const uploadClient = multer({
    storage: storage,
    limits: {
        fileSize: '10000000'
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/
        const mimType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimType && extname) {
            return cb(null, true)
        }
        cb('DAME UN FORMATO CORRECTO')
    }

}).single('foto')


export const getCliente = async (req, res) => {
    const { id } = req.params
    try {
        const obtenerCliente = await clientes.findOne({
            where: {
                id_cliente: id
            }
        });
        res.json(obtenerCliente);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getClientes = async (req, res) => {
    try {
        const obtenerClientes = await clientes.findAll();
        res.json(obtenerClientes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getClientesPendiente = async (req, res) => {
    try {
        const obtenerClientes = await clientes.findAll({
            where: {
                estado: 'PENDIENTE',
            },
        });
        res.json(obtenerClientes);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const insertarCliente = async (req, res) => {
    const { nombre, apellido, cedula, genero, estado, id_usuario, id_licencia } = req.body;
    const foto = req.file.path;

    if (!nombre || !apellido || !cedula || !genero || !estado || !id_usuario || !id_licencia) {
        res.status(400).json({ error: 'Alguno de los campos está vacío' });
    }

    const nombreAux = letrasMayusculas(nombre);
    const apellidoAux = letrasMayusculas(apellido);
    const generoAux = letrasMayusculas(genero);
    const estadoAux = letrasMayusculas(estado);

    if (!verificarNombre(nombre)) {
        return res.status(400).json({ message: 'Error: El nombre ingresado es inválido.' });
    }

    if (!verificarCedula(cedula)) {
        return res.status(400).json({ message: 'Error: La cédula ingresada es inválida.' });
    }

    if (!verificarGenero(genero)) {
        return res.status(400).json({ message: 'Error: El género ingresado es inválido.' });
    }

    if (!verificarEstado(estado)) {
        return res.status(400).json({ message: 'Error: El estado ingresado es inválido.' });
    }

    if (!verificarExtensionFoto(foto)) {
        return res.status(400).json({ message: 'Error: La extensión de la foto es inválida.' });
    }

    try {
        const cedulaExistente = await clientes.findOne({
            where: {
                cedula: cedula
            }
        });

        if (cedulaExistente) {
            return res.status(400).json({ message: 'La cédula ya está registrada' });
        }

        // Insertar el cliente en la base de datos
        const crearCliente = await clientes.create({
            nombre: nombreAux,
            apellido: apellidoAux,
            cedula,
            genero: generoAux,
            estado: estadoAux,
            foto,
            id_usuario,
            id_licencia
        });

        res.send('Cliente ingresado correctamente');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const editarCliente = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, apellido, cedula, genero, estado } = req.body;

        const foto = req.file.path;

        if (!id || !nombre || !apellido || !cedula || !genero || !estado) {
            return res.status(400).json({ message: 'Error: Los campos no estan completas.' });
        }
        const nombreAux = letrasMayusculas(nombre);
        const apellidoAux = letrasMayusculas(apellido);
        const generoAux = letrasMayusculas(genero);
        const estadoAux = letrasMayusculas(estado);

        if (!verificarNombre(nombre)) {
            return res.status(400).json({ message: 'Error: El nombre ingresado es inválido.' });
        }

        if (!verificarCedula(cedula)) {
            return res.status(400).json({ message: 'Error: La cédula ingresada es inválida.' });
        }

        if (!verificarGenero(genero)) {
            return res.status(400).json({ message: 'Error: El género ingresado es inválido.' });
        }

        if (!verificarEstado(estado)) {
            return res.status(400).json({ message: 'Error: El estado ingresado es inválido.' });
        }

        // if (!verificarExtensionFoto(foto)) {
        //     return res.status(400).json({ message: 'Error: La extensión de la foto es inválida.' });
        // }

        try {
            const updateCliente = await clientes.update(
                {
                    nombre: nombreAux,
                    apellido: apellidoAux,
                    cedula: cedula,
                    genero: generoAux,
                    estado: estadoAux,
                    foto
                },
                {
                    where: {
                        id_cliente: id
                    }
                }
            );
            res.send(updateCliente);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const editarEstadosCliente = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadoAux = estado;
    try {
        if (!verificarEstado(estado)) {
            return res.status(400).json({ message: 'Error: El estado ingresado es inválido.' });
        }

        try {
            const updateCliente = await clientes.update(
                {
                    estado: estadoAux,
                },
                {
                    where: {
                        id_cliente: id
                    }
                }
            );
            res.send(updateCliente);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteClient = await clientes.destroy({
            where: {
                id_cliente: id
            }
        })
        res.sendStatus(200);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const recuperarContrasena = async (req, res) => {
    try {
        const { correo, contrasenaNueva, cedula } = req.body;

        const correoAux = correo.toLowerCase();

        try {
            // Buscar el id del usuario mediante el correo
            const usuario = await usuarios.findOne({ where: { correo: correoAux } });
            if (!usuario) {
                return res.status(404).json({ message: "Error: No se encontró el usuario con el correo especificado." });
            }
            const id = usuario.id_usuario;
            // Verificar si el usuario existe mediante la cedula
            const usuarioExistente = await clientes.findOne({ where: { id_usuario: id, cedula } });
            if (!usuarioExistente) {
                return res.status(404).json({ message: "Error: No se encontró el usuario con la cédula especificada." });
            }

            // Actualizar la contraseña del usuario
            const actualizar = await usuarios.update({ contrasena: contrasenaNueva }, {
                where: {
                    id_usuario: id
                }
            });
            enviarMail(contrasenaNueva);

            res.send(actualizar);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    
};