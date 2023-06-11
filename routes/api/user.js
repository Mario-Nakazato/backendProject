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
const Post = require('../../models/post')
const { validadePost, validadePostUpdate } = require('../../middlewares/validationPost')

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

router.get('/profile', validadePagination, async function (req, res, next) {
    try {
        // Verifique se foi fornecido um parâmetro de consulta para fullName, limite e página
        const { fullName, limit, page } = req.query

        if (fullName) {
            var profile = await Profile.findProfilesByFullName(
                fullName,
                {
                    exclude: ['createdAt', 'updatedAt'],
                },
                limit,
                page
            )
        } else {
            // Recupere todos os perfis
            var profiles = await Profile.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                limit: limit,
                offset: page
            })
        }

        if ((!profile || profile.length === 0) && (!profiles || profiles.length === 0))
            return res.status(404).json({ error: "Perfil(s) não encontrado", path: "routes/api/user" })

        return res.json(profile || profiles)
    } catch (error) {
        console.error("Erro ao obter a lista de perfil(s): ", error)
        return res.status(500).json({ error: "Erro ao obter a lista de perfil(s)" })
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

router.get('/post', validadePagination, async function (req, res, next) {
    try {
        // Verifique se foi fornecido um parâmetro de consulta para filter, limite e página
        const { filter, limit, page } = req.query

        if (filter) {
            var post = await Post.findPosts(
                filter,
                {
                    exclude: ['createdAt', 'updatedAt'],
                },
                limit,
                page
            )
        } else {
            // Recupere todos os publicações
            var posts = await Post.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                limit: limit,
                offset: page
            })
        }

        if ((!post || post.length === 0) && (!posts || posts.length === 0))
            return res.status(404).json({ error: "Publicação(ões) não encontrado", path: "routes/api/user" })

        return res.json(post || posts)
    } catch (error) {
        console.error("Erro ao obter a lista de publicação(ões): ", error)
        return res.status(500).json({ error: "Erro ao obter a lista de publicação(ões)" })
    }
})

router.post('/:username/post', validadePost, authenticate, checkOver, async function (req, res, next) {
    try {
        const { username } = req.params
        const { title, content } = req.body

        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        const newPost = await Post.createPost(user.id, title, content)

        return res.status(201).json(newPost)
    } catch (error) {
        console.error("Erro ao criar a publicação: ", error)
        return res.status(500).json({ error: "Erro ao criar a publicação" })
    }
})

router.delete('/:username/post/:id', authenticate, checkOver, async function (req, res, next) {
    const { username, id } = req.params

    try {
        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        const post = await Post.findPostByIdUserId(id, user.id)
        if (!post) {
            return res.status(409).json({ error: "Publicação não encontrado", path: "routes/api/user" })
        }

        await post.destroy()

        return res.json({ debug: "Publicação excluído com sucesso" })
    } catch (error) {
        console.error("Erro ao excluir a publicação: ", error)
        return res.status(500).json({ error: "Erro ao excluir a publicação" })
    }
})

router.put('/:username/post/:id', validadePostUpdate, authenticate, checkOver, async function (req, res, next) {
    try {
        const { username, id } = req.params
        const { newTitle, newContent } = req.body


        // Verifique se o usuário existe
        const user = await User.findUserByUsername(username)
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado", path: "routes/api/user" })
        }

        const post = await Post.findPostByIdUserId(id, user.id)
        if (!post) {
            return res.status(409).json({ error: "Publicação não encontrado", path: "routes/api/user" })
        }

        // Atualize a publicação
        const updatedPost = await Post.updatePost(id, user.id, { title: newTitle, content: newContent })

        if (!updatedPost) {
            return res.status(404).json({ error: "Publicação não alterado", path: "routes/api/user" })
        }

        return res.json({ fullName: newTitle, bio: newContent }) // Talvez deve retornar um jwt novo por causa da atualização se quiser deixar automatico senão tera que entrar novamente para o novo jwt
    } catch (error) {
        console.error("Erro ao atualizar a publicação: ", error)
        return res.status(500).json({ error: "Erro ao atualizar a publicação" })
    }
})

module.exports = router