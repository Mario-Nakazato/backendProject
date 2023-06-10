const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    /*
        Configurar no insomnia
        na aba Auth types
        Token é o token mesmo
        Prefix é o Bearer
    */
    let bearer = req.headers["authorization"] || ""
    let aux = bearer.split(" ")
    let token = ""
    if (aux[0] == "Bearer") {
        token = aux[1]
    }

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido", path: "middlewares/authenticate" })
    }

    try {
        // Verifique o token e obtenha o payload
        const payload = jwt.verify(token, process.env.PRIVATE_KEY)

        // Adicione o payload à solicitação para uso posterior
        req.user = payload

        next()
    } catch (error) {
        console.error("Erro ao verificar o token: ", error)
        return res.status(403).json({ error: "Token inválido", path: "middlewares/authenticate" })
    }
}

module.exports = authenticate
