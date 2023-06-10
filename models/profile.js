const { DataTypes } = require('sequelize')
const sequelize = require('../database/sqliteDB')
const User = require('./user')

const Profile = sequelize.define('Profiles', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    }
})

// Associação entre Profile e User (um para um)
Profile.belongsTo(User, { foreignKey: 'userId' })
User.hasOne(Profile, { foreignKey: 'userId' })

// Encontre um perfil pelo id do usuário
Profile.findProfileByUserId = async (userId, filtro) => {
    const profile = await Profile.findOne({
        where: { userId },
        attributes: filtro
    })
    return profile
}

// Cria um novo perfil associado a um usuário pelo id
Profile.createProfile = async (fullName, bio, userId) => {
    const profile = await Profile.create({
        fullName,
        bio,
        userId,
    })
    return profile
}

module.exports = Profile
