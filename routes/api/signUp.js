var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { validadeUser } = require('../../middlewares/validationUser')

router.post('/', validadeUser, async function (req, res, next) {
    try {
        const { username, password } = req.body

        // Verifique se o usuário já existe no banco de dados
        const existingUser = await User.findUserByUsername(username)
        if (existingUser) {
            return res.status(409).json({ error: "Usuário já existe" })
        }

        // Criar o hash da senha com salt
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))

        // Crie um novo usuário
        const newUser = await User.createUser(username, hashedPassword)

        return res.status(201).json(newUser)
    } catch (error) {
        console.error("Erro ao cadastrar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao cadastrar o usuário" })
    }
    //res.json({ debug: "Rota para cadastrar um novo usuário.", requisição: req.body })
})

module.exports = router
