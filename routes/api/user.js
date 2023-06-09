var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const authenticate = require('../../middlewares/authenticate')
const checkOver = require('../../middlewares/checkOver')
const bcrypt = require('bcrypt')

router.delete('/:username', authenticate, checkOver, async function (req, res, next) {
    const { username } = req.params;

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        if (user.id == 1)
            return res.status(403).json({ debug: "Usuário não pode ser excluído" })

        await user.destroy()

        return res.json({ debug: "Usuário excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir o usuário: ", error)
        return res.status(500).json({ error: "Erro ao excluir o usuário" })
    }
})

router.put('/:username', authenticate, checkOver, async function (req, res, next) {
    try {
        const { username } = req.params
        const { newUsername, newPassword, isAdm } = req.body

        if (newUsername) {
            // Verifique se o novo nome de usuário já está em uso
            let existingUser = await User.findUserByUsername(newUsername)
            if (existingUser) {
                return res.status(400).json({ error: "Nome de usuário já está em uso" })
            }
        }

        let hashedPassword
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))
        }

        if ((isAdm !== undefined && !req.user.isAdm) || req.user.id === 1)
            return res.status(401).json({ error: "Alteração não autorizado" })

        // Atualize o nome de usuário
        const updatedUser = await User.updateUser(username, { username: newUsername, password: hashedPassword, isAdm })

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuário não encontrado" })
        }

        return res.json({ username: newUsername, password: hashedPassword, isAdm }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o usuário" })
    }
})


module.exports = router;