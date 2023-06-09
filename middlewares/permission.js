const User = require('../models/user')

const permission = async (req, res, next) => {
    const { username } = req.params
    const jwtUser = req.user

    const user = await User.findUserByUsername(jwtUser.username)
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado", path: "middlewares/permission" })
    }

    // Verifique se o usuário na rota corresponde ao usuário autenticado
    if (user.id !== 1 && !user.isAdm) {
        return res.status(403).json({ error: "Acesso não autorizado", path: "middlewares/permission" })
    }

    req.user = user
    //req.user.isAdm = user.id === 1 ? true : user.isAdm
    next()
}

module.exports = permission;
