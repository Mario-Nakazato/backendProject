var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const authenticate = require('../../middlewares/authenticate')
const permission = require('../../middlewares/permission')
const bcrypt = require('bcrypt')
const { validadeUserUpdate } = require('../../middlewares/validationUser')

router.delete('/:username', authenticate, permission, async function (req, res, next) {
    const { username } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/adm" })
        }

        if (user.id == 1) // Se adm não pode ser excluido por adm então || user.isAdm
            return res.status(403).json({ error: "Usuário não pode ser excluído", path: "routes/api/adm" })

        await user.destroy()

        return res.json({ debug: "Usuário excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir o usuário: ", error)
        return res.status(500).json({ error: "Erro ao excluir o usuário" })
    }
})

router.put('/:username', validadeUserUpdate, authenticate, permission, async function (req, res, next) {
    try {
        const { username } = req.params
        const { newUsername, newPassword, isAdm } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/adm" })
        }

        if (newUsername) {
            // Verifique se o novo nome de usuário já está em uso
            let existingUser = await User.findUserByUsername(newUsername)
            if (existingUser) {
                return res.status(400).json({ error: "Nome de usuário já está em uso", path: "routes/api/adm" })
            }
        }

        let hashedPassword
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))
        }

        if (user.id == 1) // Se adm não pode ser alterado por adm então || user.isAdm
            return res.status(403).json({ error: "Usuário não pode ser Alterado", path: "routes/api/adm" })

        // Atualize o nome de usuário
        const updatedUser = await User.updateUser(username, { username: newUsername, password: hashedPassword, isAdm })

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuário não alterado", path: "routes/api/adm" })
        }

        return res.json({ username: newUsername, password: hashedPassword, isAdm }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o usuário" })
    }
})

module.exports = router;