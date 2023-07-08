
import { mensajes } from "../../models/mensajes.js";
import { verificarFecha } from "./rules.js";
import { Op } from 'sequelize';


export const crearMensaje = async (req, res) => {
    const { id_emisor, id_receptor, mensaje, fecha_emision } = req.body;

    if (!id_emisor || !id_receptor || !mensaje || !fecha_emision) {
        return res.status(400).json({ message: 'TODOS LOS CAMPOS SON OBLIGATORIOS' });
    }

    try {

        const nuevoMensaje = await mensajes.create({
            id_emisor,
            id_receptor,
            mensaje,
            fecha_emision
        })
        console.log('MENSAJE ENVIADO');
        return res.status(200).json({ message: 'Mensaje enviado' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
 

export const obtenerMensaje = async (req, res) => {
        const { id_emisor, id_receptor } = req.params;
    
        try {
        const mensajes = await mensajes.findAll({
            where: {
            [Op.or]: [
                { id_emisor: id_emisor, id_receptor: id_receptor },
                { id_emisor: id_receptor, id_receptor: id_emisor }
            ]
            }
        });
    
        res.json(mensajes);
        } catch (error) {
        return res.status(400).json({ message: error.message });
        }
    };
  