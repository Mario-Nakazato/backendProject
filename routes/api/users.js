var express = require('express');
var router = express.Router();
const User = require('../../models/user')

router.post('/', async function (req, res, next) {
    try {
        const { username, password } = req.body

        // Verifique se o usuário já existe no banco de dados
        const existingUser = await User.findOne({ where: { username } })
        if (existingUser) {
            return res.status(400).json({ error: "Usuário já existe" })
        }

        // Crie um novo usuário
        const newUser = await User.create({
            username,
            password,
        });

        return res.status(201).json(newUser)
    } catch (error) {
        console.error("Erro ao cadastrar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao cadastrar o usuário" })
    }
    //res.json({ debug: "Rota para cadastrar um novo usuário.", requisição: req.body })
});

module.exports = router;
