import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { roles } from "./roles.js";

export const usuarios = sequelize.define('usuarios', {
    id_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    correo: {
        type: DataTypes.STRING,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING
    },
    estado:{
        type: DataTypes.STRING
    }

},
{
    timestamps: false
}
)
usuarios.belongsTo(roles, {
    foreignKey: 'id_rol',
    targetKey: 'id_rol'
});

roles.hasOne(usuarios, {
    foreignKey: 'id_rol',
    sourceKey: 'id_rol'
});
