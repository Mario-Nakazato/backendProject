const { DataTypes } = require('sequelize')
const sequelize = require('../database/sqliteDB')

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

// Encontre um usuário pelo nome de usuário (username)
User.findUserByUsername = async (username) => {
    const user = await User.findOne({ where: { username } });
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