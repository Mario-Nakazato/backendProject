const sequelize = require("../database/sqliteDB")
const User = require("../models/user")
const Profile = require("../models/profile")
const bcrypt = require('bcrypt')

const createDatabase = async (force) => {
    await sequelize.sync({ force })
}

const createDefaultUsers = async () => {
    const users = [
        { username: 'root', password: 'admin' },
        { username: 'mario', password: 'senha' },
        { username: 'adriano', password: '1234' },
        { username: 'carlos', password: 'carlos123' },
        { username: 'julia', password: 'julia456' },
        { username: 'roberta', password: 'roberta789' },
        { username: 'sandra', password: 'sandra2023' },
        { username: 'aline', password: 'aline567' },
    ]

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT))
        await User.createUser(user.username, hashedPassword)
    }
}

const createDefaultProfiles = async () => {
    const profiles = [
        { fullName: 'Mario N.', bio: 'Administrador master' },
        { fullName: 'Mario Nakazato', bio: 'Engenharia de Computação' },
        { fullName: 'Adriana Silva', bio: 'Designer Gráfica' },
        { fullName: 'Carlos Pereira', bio: 'Empreendedor e Palestrante' },
        { fullName: 'Julia Santos', bio: 'Estudante de Medicina' },
        { fullName: 'Roberto Almeida', bio: 'Desenvolvedor Web Full Stack' },
        { fullName: 'Sandra Ferreira', bio: 'Advogada Especializada em Direitos Humanos' },
        { fullName: 'Aline Castro', bio: 'Nutricionista Esportiva' },
    ]


    for (let i = 1; i <= profiles.length; i++) {
        const profile = profiles[i - 1];
        await Profile.createProfile(i, profile.fullName, profile.bio);
    }
}

const checkInstallationStatus = async () => {
    const user = await User.findUserByPk(1)
    return user
}

module.exports = {
    createDatabase,
    createDefaultUsers,
    createDefaultProfiles,
    checkInstallationStatus
}
