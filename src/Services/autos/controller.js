import { autos } from "../../models/autos.js";
import { aEntero, guardarImagen, letrasMayusculas } from "./helpers.js";
import { verificarTipo, Formato, PrimerLetra, segundaLetra, estados, verificarAnio, verificarPrecio } from "./rules.js";
import multer from 'multer';
import path from 'path'

export const getAuto = async (req, res) => {
    const { id } = req.params;

    try {
        const obtenerAuto = await autos.findOne({
            where: {
                id_auto: id
            }
        });
        res.json(obtenerAuto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}
export const getAutos = async (req, res) => {

    try {
        const obtenerAutos = await autos.findAll();

        res.json(obtenerAutos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/autos')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

export const upload = multer({
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

}).single('fotos')


export const insertarAuto = async (req, res) => {

    const { placas, marca, modelo, anio, detalles, estado, tipo, precio } = req.body;
    
    const fotos = req.file.path;
    console.log('Placas: ' + placas + ' marca: ' + marca + ' estado: ' + estado + 'detalles' + detalles + 'tipo' + tipo + ' PRECIO' +precio)
    console.log('Fotos: ' + fotos)
    // Verificar si algún campo está vacío

    if (!placas || !marca || !modelo || !anio || !detalles || !estado || !tipo || !precio) {
        return res.status(400).json({ message: 'Error: Todos los campos deben ser completados' });
    }
    const marcaAux = letrasMayusculas(marca);
    const modeloAux = letrasMayusculas(modelo);
    const placasAux = letrasMayusculas(placas);
    const estadoAux = letrasMayusculas(estado);
    const tipoAux = letrasMayusculas(tipo);
    const detallesAux = letrasMayusculas(detalles);
    const precioAux = aEntero(precio);

    // Validar formato de la placa
    if (!Formato(placasAux)) {
        return res.status(400).json({ message: 'Error: El formato de la placa es inválido' });
    }

    // Validar primera letra de la placa
    if (!PrimerLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La primera letra de la placa es inválida' });
    }

    // Validar segunda letra de la placa
    if (!segundaLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La segunda letra de la placa es inválida' });
    }

    // Validar estado

    if (!estados(estadoAux)) {
        return res.status(400).json({ message: 'Error: El estado ingresado es inválido' });
    }

    // Validar año
    if (!verificarAnio(anio)) {
        return res.status(400).json({ message: 'Error: El año ingresado es inválido' });
    }

    if (!verificarTipo(tipoAux)) {
        return res.status(400).json({ message: 'Error: El tipo ingresado es inválido' });
    }

    if (!verificarPrecio(precioAux)) {
        return res.status(400).json({ message: 'Error: El precio ingresado es inválido' });
    }


    // const rutaImagen1= await guardarImagen(fotos);
    // const rutaImagen1 = '/img/autos/mazda.png'
    try {
        const insertarAuto = await autos.create({
            placas: placasAux,
            marca: marcaAux,
            modelo: modeloAux,
            anio,
            detalles: detallesAux,
            fotos,
            estado: estadoAux,
            tipo: tipoAux,
            precio: precioAux
        });

        // console.log('AUTO CREADO,', insertarAuto);
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export const eliminarAutos = async (req, res) => {
    const { id } = req.params;

    try {
        const eliminar = await autos.destroy({
            where: {
                id_auto: id
            }
        })
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const editarAutos = async (req, res) => {
    const { id } = req.params;
    const { placas, marca, modelo, anio, detalles, estado, tipo, precio } = req.body;
    const fotos = req.file.path;
    // Validar formato de la placa
    const marcaAux = letrasMayusculas(marca);
    const modeloAux = letrasMayusculas(modelo);
    const placasAux = letrasMayusculas(placas);
    const estadoAux = letrasMayusculas(estado);
    const tipoAux = letrasMayusculas(tipo);
    const detallesAux = letrasMayusculas(detalles);
    const precioAux = aEntero(precio);

    if (!Formato(placasAux)) {
        return res.status(400).json({ message: 'Error: El formato de la placa es inválido' });
    }

    // Validar primera letra de la placa
    if (!PrimerLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La primera letra de la placa es inválida' });
    }
    // Validar segunda letra de la placa
    if (!segundaLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La segunda letra de la placa es inválida' });
    }

    // Validar estado
    if (!estados(estadoAux)) {
        return res.status(400).json({ message: 'Error: El estado ingresado es inválido' });
    }

    // Validar año
    if (!verificarAnio(anio)) {
        return res.status(400).json({ message: 'Error: El año ingresado es inválido' });
    }

    if (!verificarTipo(tipoAux)) {
        return res.status(400).json({ message: 'Error: El tipo ingresado es inválido' });
    }

    if (!verificarPrecio(precioAux)) {
        return res.status(400).json({ message: 'Error: El precio ingresado es inválido' });
    }


    try {
        const editar = await autos.update({
            placas: placasAux,
            marca: marcaAux,
            modelo: modeloAux,
            anio: anio,
            fotos,
            detalles: detallesAux,
            estado: estadoAux,
            tipo: tipoAux,
            precio: precioAux
        }, {
            where: {
                id_auto: id
            }
        })
        res.send(editar);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const editarAutosSinFoto = async (req, res) => {
    const { id } = req.params;
    const { placas, marca, modelo, anio, detalles, estado, tipo, precio } = req.body;

    const marcaAux = letrasMayusculas(marca);
    const modeloAux = letrasMayusculas(modelo);
    const placasAux = letrasMayusculas(placas);
    const estadoAux = letrasMayusculas(estado);
    const tipoAux = letrasMayusculas(tipo);
    const detallesAux = letrasMayusculas(detalles);
    const precioAux = aEntero(precio);

    if (!Formato(placasAux)) {
        return res.status(400).json({ message: 'Error: El formato de la placa es inválido' });
    }

    // Validar primera letra de la placa
    if (!PrimerLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La primera letra de la placa es inválida' });
    }
    // Validar segunda letra de la placa
    if (!segundaLetra(placasAux)) {
        return res.status(400).json({ message: 'Error: La segunda letra de la placa es inválida' });
    }

    // Validar estado
    if (!estados(estadoAux)) {
        return res.status(400).json({ message: 'Error: El estado ingresado es inválido' });
    }

    // Validar año
    if (!verificarAnio(anio)) {
        return res.status(400).json({ message: 'Error: El año ingresado es inválido' });
    }

    if (!verificarTipo(tipoAux)) {
        return res.status(400).json({ message: 'Error: El tipo ingresado es inválido' });
    }

    if (!verificarPrecio(precioAux)) {
        return res.status(400).json({ message: 'Error: El precio ingresado es inválido' });
    }


    try {
        const editar = await autos.update({
            placas: placasAux,
            marca: marcaAux,
            modelo: modeloAux,
            anio: anio,
            detalles: detallesAux,
            estado: estadoAux,
            tipo: tipoAux,
            precio: precioAux
        }, {
            where: {
                id_auto: id
            }
        })
        res.send(editar);


    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}
export const cambiarEstadoAuto = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const estadoAux = letrasMayusculas(estado);
    if (!estados(estadoAux)) {
        return res.status(400).json({ message: 'Error: El estado ingresado es inválido' });
    }
    try {
        const editar = await autos.update({
            estado: estadoAux
        }, {
            where: {
                id_auto: id
            }
        })
        res.send(editar);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}