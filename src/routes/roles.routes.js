import { Router } from 'express';

import { getRol, getRoles } from '../Services/roles/controller.js';
import { Login  , actualizarUser, eliminarUser, getUser, getUsers, insertarUser, logOut } from '../Services/usuarios/controllerUser.js';
import { getAuto, getAutos, editarAutos, eliminarAutos, insertarAuto, upload, editarAutosSinFoto, cambiarEstadoAuto } from '../Services/autos/controller.js';
import { getClientes, getCliente, editarCliente, eliminarCliente, insertarCliente, uploadClient, getClientesPendiente, editarEstadosCliente, recuperarContrasena, getCorreos} from '../Services/clientes/controller.js';
import { editarLicencia, eliminarLicencia, getLicencia, getLicencias, insertarLicencia , uploadLicencias } from '../Services/licencias/controller.js';
import { getReservas, getReserva, getUserReservas, createReserva,getReservasPendiente, updateReserva, updateEstado } from '../Services/revservas/controller.js';
import { cancelarPago, crearPago, getPago, getPagos, getPagosUser } from '../Services/pagos/controller.js';
import { crearMensaje, obtenerMensaje } from '../Services/mensajes/controller.js';
import { crearHistorials, obtenerHistorial , obtenerHistoriales} from '../Services/historial/controller.js';
import { DatosVar, editaVars } from '../Services/Configs/Controller.js';

// import { rolesRutas } from '../Services/roles/routes.js'
// const roles = require('../Services/roles/routes.js');


const router = new Router();

router.get('/config', DatosVar)
router.put('/config', editaVars);
router.get('/roles', getRoles);
router.get('/roles/:id', getRol);

router.get('/user', getUsers)
router.get('/user/:id', getUser)
router.get('/correos', getCorreos)
router.post('/login', Login)
router.post('/logOut', logOut)
router.post('/recuperarContrasena', recuperarContrasena)
router.post('/user', insertarUser);
router.put('/user/:id', actualizarUser);
router.delete('/user:id',eliminarUser);
    
router.get('/licencia', getLicencias);
router.get('/licencia/:id', getLicencia);
router.put('/licencia/:id', uploadLicencias, editarLicencia);
router.post('/licencia', uploadLicencias,  insertarLicencia);
router.delete('/licencia:id', eliminarLicencia);

router.get('/clientes', getClientes);
router.get('/clientes/:id', getCliente);
router.get('/clientesPendiente', getClientesPendiente);
router.post('/cliente', uploadClient, insertarCliente);
router.put('/clientes/:id', uploadClient, editarCliente);
router.put('/clientesEstado/:id', editarEstadosCliente);
router.delete('/clientes/:id', eliminarCliente);
    
router.get('/autos', getAutos);
router.get('/autos/:id', getAuto);
router.post('/autos', upload, insertarAuto);
router.delete('/autos/:id', eliminarAutos);
router.put('/autos/:id', upload, editarAutos);
router.put('/autosfile/:id', editarAutosSinFoto);
router.put('/autosEstado/:id', cambiarEstadoAuto)

router.get('/reservas', getReservas)
router.get('/reservasPendiente', getReservasPendiente)
router.get('/reservas/:id', getReserva);
router.get('/reserva/cliente/:id', getUserReservas);
router.post('/reservas', createReserva);
router.put('/reserva/estado/:id', updateEstado);

router.get('/pagos', getPagos)
router.get('/pagos/:id', getPago)
router.get('/pagosCliente/:id', getPagosUser)
router.post('/pagos', crearPago);
router.delete('/pagos/:pago', cancelarPago)


router.post('/mensajes', crearMensaje);
router.get('/obtenerMensaje/:id/:id_', obtenerMensaje);

router.post('/historial', crearHistorials)
router.get('/historial', obtenerHistoriales)
router.get('/historial/:id', obtenerHistorial);

export default router;