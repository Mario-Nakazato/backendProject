const { DataTypes, Op } = require('sequelize')
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
Profile.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' })
User.hasOne(Profile, { foreignKey: 'userId' })

Profile.sync()

// Atualize um perfil pelo id do usuário
Profile.updateProfile = async (userId, data) => {
    const [updatedProfile] = await Profile.update(data, {
        where: { userId }
    })
    return updatedProfile
}

// Encontre um perfil pelo fullName
Profile.findProfilesByFullName = async (fullName, attributes, limit, offset) => {
    const profiles = await Profile.findAll({
        where: {
            fullName: {
                [Op.like]: '%' + fullName + '%'
            }
        },
        attributes,
        limit,
        offset
    })
    return profiles
}

// Encontre um perfil pelo id do usuário
Profile.findProfileByUserId = async (userId, attributes) => {
    const profile = await Profile.findOne({
        where: { userId },
        attributes
    })
    return profile
}

// Cria um novo perfil associado a um usuário pelo id
Profile.createProfile = async (userId, fullName, bio) => {
    const profile = await Profile.create({
        fullName,
        bio,
        userId,
    })
    return profile
}

module.exports = Profile