const User = require('../models/user')

const checkOver = async (req, res, next) => {
    const { username } = req.params
    const jwtUser = req.user

    // Verifique se o usuário na rota corresponde ao usuário autenticado
    if (jwtUser.username !== username) {
        return res.status(403).json({ error: "Acesso não autorizado" })
    }

    const user = await User.findUserByUsername(jwtUser.username)
    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }

    req.user = user
    next()
}

module.exports = checkOver;
