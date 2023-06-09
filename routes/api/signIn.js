const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body

        // Encontre o usuário pelo nome de usuário (username)
        const user = await User.findUserByUsername(username)

        // Verifique se o usuário existe e a senha está correta
        if (!user) {
            return res.status(400).json({ error: "Credenciais inválidas" })
            //return res.status(400).json({ error: "Usuário inválido" }) // Não facilitar atacante com este erro
        }

        // Verifique se a senha está correta
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ error: "Credenciais inválidas" })
            //return res.status(401).json({ error: "Senha inválida" }) // Não facilitar atacante com este erro
        }

        const token = jwt.sign({ username: user.username }, process.env.PRIVATE_KEY, { expiresIn: "8 min" })

        // Envie o token como resposta
        return res.status(200).json({ token })
    } catch (error) {
        console.error("Erro ao realizar o login: ", error)
        return res.status(500).json({ error: "Erro ao realizar o login" })
    }
});

module.exports = router;
