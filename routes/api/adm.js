var express = require('express');
var router = express.Router();
const User = require('../../models/user')
const authenticate = require('../../middlewares/authenticate')
const permission = require('../../middlewares/permission')
const bcrypt = require('bcrypt')
const { validadeUserUpdate } = require('../../middlewares/validationUser')
const Profile = require('../../models/profile')
const { validadeProfile, validadeProfileUpdate } = require('../../middlewares/validationProfile')
const { validadePostUpdate } = require('../../middlewares/validationPost')
const Post = require('../../models/post')
const Comment = require('../../models/comment')
const { validadeCommentUpdate } = require('../../middlewares/validationComment')

router.delete('/:username', authenticate, permission, async function (req, res, next) {
    const { username } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/adm" })

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
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/adm" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser alterado por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Usuário não pode ser Alterado", path: "routes/api/adm" })

        if (newUsername) {
            // Verifique se o novo nome de usuário já está em uso
            const existingUser = await User.findUserByUsername(newUsername)
            if (existingUser)
                return res.status(409).json({ error: "Nome de usuário já está em uso", path: "routes/api/adm" })
        }

        if (newPassword)
            var hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))

        // Atualize o nome de usuário
        const updatedUser = await User.updateUser(username, { username: newUsername, password: hashedPassword, isAdm })
        if (!updatedUser)
            return res.status(404).json({ error: "Usuário não alterado", path: "routes/api/adm" })

        return res.json({ username: newUsername, password: hashedPassword, isAdm }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o usuário: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o usuário" })
    }
})

router.post('/:username/profile', validadeProfile, authenticate, permission, async function (req, res, next) {
    try {
        const { username } = req.params
        const { fullName, bio } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser criado por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Perfil não pode ser criado", path: "routes/api/adm" })

        // Verifique se o perfil já existe no banco de dados
        const existingProfile = await Profile.findProfileByUserId(user.id)
        if (existingProfile)
            return res.status(409).json({ error: "Perfil já existe", path: "routes/api/user" })

        const newProfile = await Profile.createProfile(user.id, fullName, bio)

        return res.status(201).json(newProfile)
    } catch (error) {
        console.error("Erro ao criar o perfil: ", error)
        return res.status(500).json({ error: "Erro ao criar o perfil" })
    }
})

router.delete('/:username/profile', authenticate, permission, async function (req, res, next) {
    const { username } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser excluído por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Perfil não pode ser excluído", path: "routes/api/adm" })

        const profile = await Profile.findProfileByUserId(user.id)
        if (!profile)
            return res.status(409).json({ error: "Perfil não encontrado", path: "routes/api/user" })

        await profile.destroy()

        return res.json({ debug: "Perfil excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir o perfil: ", error)
        return res.status(500).json({ error: "Erro ao excluir o perfil" })
    }
})

router.put('/:username/profile', validadeProfileUpdate, authenticate, permission, async function (req, res, next) {
    try {
        const { username } = req.params
        const { newFullName, newBio } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser alterado por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Perfil não pode ser alterado", path: "routes/api/adm" })

        // Verifique se o perfil existe
        const profile = await Profile.findProfileByUserId(user.id)
        if (!profile)
            return res.status(404).json({ error: "Perfil não encontrado", path: "routes/api/user" })

        // Atualize o perfil
        const updatedProfile = await Profile.updateProfile(user.id, { fullName: newFullName, bio: newBio })
        if (!updatedProfile)
            return res.status(404).json({ error: "Perfil não alterado", path: "routes/api/user" })

        return res.json({ fullName: newFullName, bio: newBio }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar o perfil: ", error)
        return res.status(500).json({ error: "Erro ao atualizar o perfil" })
    }
})

router.delete('/:username/post/:postId', authenticate, permission, async function (req, res, next) {
    const { username, postId } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser excluído por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Publicação não pode ser excluído", path: "routes/api/adm" })

        const post = await Post.findPostByIdUserId(postId, user.id)
        if (!post)
            return res.status(409).json({ error: "Publicação não encontrado", path: "routes/api/user" })

        await post.destroy()

        return res.json({ debug: "Publicação excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir a publicação: ", error)
        return res.status(500).json({ error: "Erro ao excluir a publicação" })
    }
})

router.put('/:username/post/:postId', validadePostUpdate, authenticate, permission, async function (req, res, next) {
    try {
        const { username, postId } = req.params
        const { newTitle, newContent } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser alterado por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Publicação não pode ser alterado", path: "routes/api/adm" })

        const post = await Post.findPostByIdUserId(postId, user.id)
        if (!post)
            return res.status(409).json({ error: "Publicação não encontrado", path: "routes/api/user" })

        // Atualize a publicação
        const updatedPost = await Post.updatePost(postId, user.id, { title: newTitle, content: newContent })
        if (!updatedPost)
            return res.status(404).json({ error: "Publicação não alterado", path: "routes/api/user" })

        return res.json({ fullName: newTitle, bio: newContent }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar a publicação: ", error)
        return res.status(500).json({ error: "Erro ao atualizar a publicação" })
    }
})

router.delete('/:username/comment/:commentId', authenticate, permission, async function (req, res, next) {
    const { username, commentId } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser excluído por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Comentário não pode ser excluído", path: "routes/api/adm" })

        const comment = await Comment.findCommentByIdUserId(commentId, user.id)
        if (!comment)
            return res.status(409).json({ error: "Comentário não encontrado", path: "routes/api/user" })

        await comment.destroy()

        return res.json({ debug: "Comentário excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir a comentário: ", error)
        return res.status(500).json({ error: "Erro ao excluir a comentário" })
    }
})

router.put('/:username/comment/:commentId', validadeCommentUpdate, authenticate, permission, async function (req, res, next) {
    try {
        const { username, commentId } = req.params
        const { newContent } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })

        if (user.id == 1 && req.user.id != 1) // Se adm não pode ser alterado por adm então (user.id == 1 || user.isAdm)
            return res.status(403).json({ error: "Comentário não pode ser alterado", path: "routes/api/adm" })

        const comment = await Comment.findCommentByIdUserId(commentId, user.id)
        if (!comment)
            return res.status(409).json({ error: "Comentário não encontrado", path: "routes/api/user" })

        // Atualize a publicação
        const updatedComment = await Comment.updateComment(commentId, user.id, { content: newContent })
        if (!updatedComment)
            return res.status(404).json({ error: "Comentário não alterado", path: "routes/api/user" })

        return res.json({ content: newContent })
    } catch (error) {
        console.error("Erro ao atualizar a comentário: ", error)
        return res.status(500).json({ error: "Erro ao atualizar a comentário" })
    }
})

module.exports = router