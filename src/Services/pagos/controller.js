import { pagos } from "../../models/pagos.js"
import { letrasMayusculas } from "./helper.js";
import { verificarFecha, verificarMonto, verificarTipo } from "./rules.js";
import { clientes } from "../../models/clientes.js";
import { autos } from "../../models/autos.js";
import { enviarFactura } from "../Mensajes.js";

export const getPagos = async (req, res) => {
    try {
        const obtenerPagos = await pagos.findAll();

        res.json(obtenerPagos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPago = async (req, res) => {
    const { id } = req.params;

    try {
        const obtenerUnPago = await pagos.findOne({
            where: {
                id_pago: id,
            }
        })
        res.json(obtenerUnPago);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getPagosUser = async (req, res) => {
    const { id } = req.params;
    try {
        const pagos1 = await pagos.findAll({
            where: {
                id_cliente: id
            }
        });
        res.json(pagos1);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const crearPago = async (req, res) => {
    const { fecha_pago, tipo, monto, id_cliente, id_auto } = req.body;
    //captura el  correo del id_cliente en la tabla clientes
    //captura la marca y modelo a partir del id_auto en la tabla de autos. 
    try {
        // Consulta para obtener el correo del cliente
        const cliente = await clientes.findOne({ where: { id_cliente } });
        const correoCliente = cliente.correo;

        // Consulta para obtener la marca y modelo del auto
        const auto = await autos.findOne({ where: { id_auto } });
        const marcaAuto = auto.marca;
        const modeloAuto = auto.modelo;

        const tipoAux = letrasMayusculas(tipo);

        if (!fecha_pago || !tipo || !id_auto || !id_cliente || !monto) {
            return res.status(404).json({ message: 'TODOS LOS CAMPOS SON OBLIGATORIOS' });
        }

        if (!verificarFecha(fecha_pago)) {
            return res.status(404).json({ message: 'FECHAS DE PAGO INCORRECTOS' });
        }
        if (!verificarMonto(monto)) {
            return res.status(404).json({ message: '$ Monto incorrecto' });
        }
        if (!verificarTipo(tipoAux)) {
            return res.status(404).json({ message: 'Tipo de Pago incorrecto' });
        }

        try {
            const insert = await pagos.create({
                fecha_pago: fecha_pago,
                tipo: tipoAux,
                monto: monto,
                id_cliente: id_cliente,
                id_auto: id_auto
            })
            enviarFactura(correoCliente, marcaAuto, modeloAuto, monto);
            console.log('PAGO REGISTRADO', insert);
            res.send('Pago realizado');
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

export const cancelarPago = async (req, res) => {
    const { id } = req.params;
    try {
        const cancelar = await pagos.destroy({
            where: {
                id_pago: id
            }
        })
        res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}