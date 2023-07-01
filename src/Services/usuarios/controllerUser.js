import { usuarios } from "../../models/usuarios.js";
import { validarCorreoContrasena } from './rules.js'
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const totalUsuarios = await usuarios.findAll();
    // res.send(totalUsuarios)
    res.json(totalUsuarios);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}


export const insertarUser = async (req, res) => {
  const { id_rol, correo, contrasena, estado } = req.body;

  const correoAux = correo.toLowerCase();
  const estadoAux = estado.toUpperCase();
  if (!validarCorreoContrasena(correoAux, contrasena)) {
    return res.status(403).json({ message: "Error: Los datos ingresados son inválidos." });
  }

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await usuarios.findOne({
      where: {
        correo: correoAux
      }
    });
    if (usuarioExistente) {
      return res.status(403).json({ message: "Error: El usuario  no disponile" });
    }

    // Crear el nuevo usuario
    const nuevoUser = await usuarios.create({
      id_rol,
      correo: correoAux,
      contrasena,
      estado: estadoAux,
    });

    console.log("Nuevo Usuario", nuevoUser);
    res.send("USUARIO CREADO BRO :3");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const unUser = await usuarios.findOne({
      where: {
        id_usuario: id
      }
    })
    // res.send(unUser);
    res.json(unUser);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

}

export const actualizarUser = async (req, res) => {
  const { id } = req.params;
  const { correo, contrasena, estado } = req.body;

  if (!validarCorreoContrasena(correo, contrasena)) {
    return res.status(403).json({ message: "Error: Los datos ingresados son inválidos." });
  }

  const correoAux = correo.toLowerCase();
  const estadoAux = estado.toUpperCase();

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await usuarios.findOne({ correo: correoAux });
    if (usuarioExistente && usuarioExistente.id_usuario !== id) {
      return res.status(403).json({ message: "Error: El usuario ya existe en el sistema." });
    }

    // Actualizar los datos del usuario
    const actualizar = await usuarios.update({ correo: correoAux, contrasena, estado: estadoAux }, {
      where: {
        id_usuario: id
      }
    });

    res.send(actualizar);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const eliminarUser = async (req, res) => {
  const { id } = req.params;

  try {
    await usuarios.destroy({
      where: {
        id_usuario: id
      }
    })
    res.send("USUARIO ELINADO");
    res.sendStatus(200);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const Login = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    const unUser = await usuarios.findOne({
      where: {
        correo: correo,
        contrasena: contrasena
      }
    });
    // Verificar si se encontró al usuario y las credenciales coinciden
    if (unUser && unUser.estado === 'DESCONECTADO') {
      // Cambiar el estado a "CONECTADO"
      unUser.estado = 'CONECTADO';
      await unUser.save();

      // Generar el token
      const token = jwt.sign({ correo: unUser.correo }, 'secreto', { expiresIn: '1h' });

      // Retornar los datos del usuario (incluyendo la contraseña encriptada) y un status indicando que el inicio de sesión fue exitoso
      res.status(200).json({
        usuario: {
          id: unUser.id,
          correo: unUser.correo,
          rol: unUser.id_rol,
          contrasena: unUser.contrasena, // Aquí se retorna la contraseña encriptada
        },
        token: token,
        message: 'Inicio de sesión exitoso'
      });
    } else if (unUser && unUser.estado === 'CONECTADO') {
      // El usuario ya está conectado, enviar un mensaje de aviso
      return res.status(500).json({ message: 'El usuario ya está conectado' });
    } else {
      // Las credenciales son incorrectas o el usuario no existe
      return res.status(500).json({ message: 'Credenciales inválidas' });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const logOut = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, 'secreto');
    const correo = decodedToken.correo;

    const unUser = await usuarios.findOne({
      where: {
        correo: correo
      }
    });

    // Verificar si se encontró al usuario y su estado es "CONECTADO"
    if (unUser && unUser.estado === 'CONECTADO') {
      // Cambiar el estado a "DESCONECTADO"
      unUser.estado = 'DESCONECTADO';
      await unUser.save();

      // Retornar un status indicando que el cierre de sesión fue exitoso
      res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } else if (unUser && unUser.estado === 'DESCONECTADO') {
      // El usuario ya está desconectado, enviar un mensaje de aviso
      res.json({ message: 'El usuario ya está desconectado' });
    } else {
      // El usuario no existe
      res.json({ message: 'El usuario no existe' });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
