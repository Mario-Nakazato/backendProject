const User = require('../models/user')

const checkOver = async (req, res, next) => {
    const { username } = req.params
    const userjwt = req.user

    const user = await User.findUserByUsername(userjwt.username)
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }

    // Verifique se o usuário na rota corresponde ao usuário autenticado
    if (user.id !== 1 && !user.isAdm && userjwt.username !== username) {
        return res.status(403).json({ error: "Acesso não autorizado" })
    }

    req.user = user
    req.user.isAdm = user.id === 1 ? true : user.isAdm
    next()
}

module.exports = checkOver;
