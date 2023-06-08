const User = require('../models/user')

const checkOver = async (req, res, next) => {
    const { username } = req.params
    const userjwt = req.user
    //userjwt.adm = true
    console.log(userjwt.adm, !userjwt.adm, userjwt.username, username)
    //const user = await User.findUserByUsername(userjwt) pensei em outra coisa ao invez de buscar no banco

    // Verifique se o usuário na rota corresponde ao usuário autenticado
    if (!userjwt.adm && userjwt.username !== username) {
        return res.status(403).json({ error: "Acesso não autorizado" })
    }

    next()
}

module.exports = checkOver;
