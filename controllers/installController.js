const sequelize = require("../database/sqliteDB")
const User = require("../models/user")
const bcrypt = require('bcrypt')

const createDatabase = async () => {
    await sequelize.sync({ force: true })
};

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
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT))
        await User.createUser(user.username, hashedPassword)
    }
};

const checkInstallationStatus = async () => {
    const user = await User.findUserByPk(1)
    return user
};

module.exports = {
    createDatabase,
    createDefaultUsers,
    checkInstallationStatus
};
