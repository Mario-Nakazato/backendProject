var express = require('express');
var router = express.Router();
const sequelize = require("../../database/sqliteDB")
const User = require("../../models/user")
const bcrypt = require('bcrypt')

router.get('/', async function (req, res, next) {
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
    try {
        await User.sync() // Cria as tabelas se não existir
        const user = await User.findUserByPk(1)
        // Só instala o banco se não existir administrador padrão
        if (!user) {
            await sequelize.sync({ force: true })
            for (const user of users) {
                const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.SALT))
                await User.createUser(user.username, hashedPassword);
            }
            return res.json({ debug: "Instalado" })
        }

        res.status(406).json({ debug: "Instalação já foi realizada" })
    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados: ", error)
        res.status(500).json({ error: "Erro ao sincronizar o banco de dados" })
    }
});

module.exports = router;
