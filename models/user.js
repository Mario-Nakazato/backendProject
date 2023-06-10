const { DataTypes } = require('sequelize')
const sequelize = require('../database/sqliteDB')

const User = sequelize.define('Users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdm: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
})

// Atualize um usuário pelo nome de usuário (username)
User.updateUser = async (username, data) => {
    const [updatedUser] = await User.update(data, {
        where: { username },
        //returning: true,
    })
    return updatedUser
}

// Encontre um usuário pelo ID (Primary Key)
User.findUserByPk = async (id) => {
    const user = await User.findOne({ where: { id } })
    return user
}

// Encontre um usuário pelo nome de usuário (username) é Primary Key também pois é valor único
User.findUserByUsername = async (username, attributes) => {
    const user = await User.findOne({
        where: { username },
        attributes
    })
    return user
}

// Crie um novo usuário
User.createUser = async (username, password) => {
    const user = await User.create({
        username,
        password,
    })
    return user
}

module.exports = User