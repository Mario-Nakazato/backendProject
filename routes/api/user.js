var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const authenticate = require('../../middlewares/authenticate')
const checkOver = require('../../middlewares/checkOver')
const bcrypt = require('bcrypt')
const { validadeUserUpdate } = require('../../middlewares/validationUser')
const { validadePagination } = require('../../middlewares/validationPagination');
const Profile = require('../../models/profile');

router.get('/', validadePagination, async function (req, res, next) {
    try {
        // Verifique se foi fornecido um parâmetro de consulta para username
        const { username, limit, page } = req.query

        // Converta os valores de limite e página para números inteiros
        const limitInt = limit ? parseInt(limit) : undefined
        const pageInt = page ? parseInt(page) : undefined

        const offset = (pageInt - 1) * limitInt || undefined

        // Recupere todos os usuários
        if (username) {
            // Busque usuários por nome de usuário (username)
            var user = await User.findUserByUsername(
                username,
                { exclude: ['password', 'createdAt', 'updatedAt'] }
            )
        } else {
            var users = await User.findAll({
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
                limit: limitInt,
                offset: offset
            })
        }

        if (!user && (!users || users.length === 0))
            return res.status(404).json({ error: "Usuário(s) não encontrado", path: "routes/api/user" })

        return res.json(user || users)
    } catch (error) {
        console.error("Erro ao obter a lista de usuários: ", error)
        return res.status(500).json({ error: "Erro ao obter a lista de usuários" })
    }
})

router.delete('/:username', authenticate, checkOver, async function (req, res, next) {
    const { username } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        if (user.id == 1)
            return res.status(403).json({ error: "Usuário não pode ser excluído", path: "routes/api/user" })

        await user.destroy()

        return res.json({ debug: "Usuário excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir o usuário: ", error)
        return res.status(500).json({ error: "Erro ao excluir o usuário" })
    }
})

router.put('/:username', validadeUserUpdate, authenticate, checkOver, async function (req, res, next) {
    try {
        const { username } = req.params
        const { newUsername, newPassword } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        if (newUsername) {
            // Verifique se o novo nome de usuário já está em uso
            let existingUser = await User.findUserByUsername(newUsername)
            if (existingUser) {
                return res.status(400).json({ error: "Nome de usuário já está em uso", path: "routes/api/user" })
            }
        }

        let hashedPassword
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))
        }

        // Atualize o nome de usuário
        const updatedUser = await User.updateUser(username, { username: newUsername, password: hashedPassword })

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuário não alterado", path: "routes/api/user" })
        }

        return res.json({ username: newUsername, password: hashedPassword }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o usuário" })
    }
})

module.exports = router;