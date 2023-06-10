var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const authenticate = require('../../middlewares/authenticate')
const checkOver = require('../../middlewares/checkOver')
const bcrypt = require('bcrypt')
const { validadeUserUpdate } = require('../../middlewares/validationUser')
const { validadePagination } = require('../../middlewares/validationPagination')
const Profile = require('../../models/profile')
const { validadeProfile, validadeProfileUpdate } = require('../../middlewares/validationProfile')

router.get('/', validadePagination, async function (req, res, next) {
    try {
        // Verifique se foi fornecido um parâmetro de consulta para username, limite e página
        const { username, limit, page } = req.query

        if (username) {
            // Busque usuários por nome de usuário (username)
            var user = await User.findUserByUsername(
                username,
                { exclude: ['password', 'createdAt', 'updatedAt'] }
            )
        } else {
            // Recupere todos os usuários
            var users = await User.findAll({
                attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
                limit: limit,
                offset: page
            })
        }

        if (!user && (!users || users.length === 0))
            return res.status(404).json({ error: "Usuário(s) não encontrado", path: "routes/api/user" })

        return res.json(user || users)
    } catch (error) {
        console.error("Erro ao obter a lista de usuário(s): ", error)
        return res.status(500).json({ error: "Erro ao obter a lista de usuário(s)" })
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
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        if (newUsername) {
            // Verifique se o novo nome de usuário já está em uso
            let existingUser = await User.findUserByUsername(newUsername)
            if (existingUser) {
                return res.status(409).json({ error: "Nome de usuário já está em uso", path: "routes/api/user" })
            }
        }

        let hashedPassword
        if (newPassword) {
            hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))
        }

        // Atualize o usuário
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

router.post('/:username/profile', validadeProfile, authenticate, checkOver, async function (req, res, next) {
    try {
        const { username } = req.params
        const { fullName, bio } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        // Verifique se o perfil já existe no banco de dados
        const existingProfile = await Profile.findProfileByUserId(user.id)
        if (existingProfile) {
            return res.status(409).json({ error: "Perfil já existe", path: "routes/api/user" })
        }

        const newProfile = await Profile.createProfile(user.id, fullName, bio)

        return res.status(201).json(newProfile)
    } catch (error) {
        console.error("Erro ao criar o perfil: ", error)
        return res.status(500).json({ error: "Erro ao criar o perfil" })
    }
})

router.delete('/:username/profile', authenticate, checkOver, async function (req, res, next) {
    const { username } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        const profile = await Profile.findProfileByUserId(user.id)
        if (!profile) {
            return res.status(409).json({ error: "Perfil não encontrado", path: "routes/api/user" })
        }

        await profile.destroy()

        return res.json({ debug: "Perfil excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir o perfil: ", error)
        return res.status(500).json({ error: "Erro ao excluir o perfil" })
    }
})

router.put('/:username/profile', validadeProfileUpdate, authenticate, checkOver, async function (req, res, next) {
    try {
        const { username } = req.params
        const { newFullName, newBio } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        // Verifique se o perfil existe
        const profile = await Profile.findProfileByUserId(user.id)
        if (!profile) {
            return res.status(404).json({ error: "Perfil não encontrado", path: "routes/api/user" })
        }

        // Atualize o perfil
        const updatedProfile = await Profile.updateProfile(user.id, { fullName: newFullName, bio: newBio })

        if (!updatedProfile) {
            return res.status(404).json({ error: "Perfil não alterado", path: "routes/api/user" })
        }

        return res.json({ fullName: newFullName, bio: newBio }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o perfil: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o perfil" })
    }
})

module.exports = router