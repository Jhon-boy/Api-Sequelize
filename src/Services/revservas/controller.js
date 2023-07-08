
import { verificarAuto } from "../../logic/ComprobarAuto.js";
import { verificarDias } from "../../logic/ComprobarDias.js";
import { verificarLicencia } from "../../logic/ComprobarLicencia.js";
import { VerificarUsuario } from "../../logic/ComprobarUser.js";
import { reservas } from "../../models/reservas.js";
import { clientes } from '../../models/clientes.js'

import { determinarFechaDevolucion, validarFechaEntrega, verificarMonto } from "./rules.js";

export const getReservas = async (req, res) => {
    try {
        const obtenerReserva = await reservas.findAll();
        res.json(obtenerReserva);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getReservasPendiente = async (req, res) => {
    try {
      const obtenerReserva = await reservas.findAll({
        where: {
          estado: 'PENDIENTE',
        },
      });
      res.json(obtenerReserva);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  
export const getReserva = async (req, res) => {
    const { id } = req.params;

    try {
        const obtenerReserva = await reservas.findOne(
            {
                where: {
                    id_reserva: id
                }
            }
        );
        res.json(obtenerReserva);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserReservas = async (req, res) => {
    const { id } = req.params;

    try {
        const obtenerReserva = await reservas.findAll(
            {
                where: {
                    id_cliente: id
                }
            }
        );
        res.json(obtenerReserva);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const createReserva = async (req, res) => {

    const { id_cliente, id_auto, fecha_entrega, fecha_devolucion, monto, estado } = req.body;
    // Verificar campos vacíos
    if (!id_cliente || !id_auto || !fecha_entrega || !fecha_devolucion || !monto || !estado) {
        return res.status(400).json({ message: "Por favor, complete todos los campos requeridos." });
    }

    if (!validarFechaEntrega(fecha_entrega)) {
        return res.status(404).json({ message: 'LA FECHA ES INVALIDA de ENTREGA' });
    }
    
    if (!determinarFechaDevolucion(fecha_entrega, fecha_devolucion)) {
        return res.status(404).json({ message: 'LA FECHA DE DEVOLUCION  ES INVALIDA' });
    }

    if (!verificarMonto(monto)) {
        return res.status(404).json({ message: 'EL Monto es invalido' });
    }

    //============= REGLAS VALIDADAS ================================================================
    try {
        const licencia = await clientes.findOne({
            where: { id_cliente },
            attributes: ['id_licencia']
        });

        if (!licencia) {
            return res.status(404).json({ message: 'No se encuentra el usuario' });
        }

        // ===============================  LOGICA DE NEGOCIO =============================
        const usuarioValido = await VerificarUsuario(id_cliente);
        const autoDisponible = await verificarAuto(id_auto);
        const fechasValidas =  verificarDias(fecha_entrega, fecha_devolucion);
        const licenciaValida = await verificarLicencia(licencia.id_licencia);

        if (!usuarioValido || !autoDisponible || !fechasValidas || !licenciaValida) {
            return res.status(404).json({ message: 'NO SE CUMPLEN LAS CONDICIONES' });
        }

        // CUMPIO LAS CONDICIONES
        try {
            const crearReserva = await reservas.create({
                id_cliente,
                id_auto,
                monto,
                estado,
                fecha_entrega,
                fecha_devolucion
            });
            console.log('RESERVA REALIZADA: ' + crearReserva);
            res.json('Reserva hecha');

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }



}

export const updateReserva = async (req, res) => {
    const { id } = req.params;
    const { id_cliente, id_auto, fecha_entrega, fecha_devolucion, monto, estado } = req.body;
    try {
        const editarReserva = await reservas.update({
            id_cliente,
            id_auto,
            monto,
            estado,
            fecha_entrega,
            fecha_devolucion
        }, {
            where: {
                id_reserva: id
            }
        })
        res.send(editarReserva);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        const editarReserva = await reservas.update({
            estado
        }, {
            where: {
                id_reserva: id
            }
        })
        res.send(editarReserva);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
