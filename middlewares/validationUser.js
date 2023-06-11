const Joi = require('joi')

const userSchema = Joi.object({
    username: Joi.string().min(2).max(64).required(),
    password: Joi.string().min(4).max(64).required(),
}).with("username", "password")

const newUserSchema = Joi.object({
    newUsername: Joi.string().min(2).max(64).optional(),
    newPassword: Joi.string().min(4).max(64).optional(),
    isAdm: Joi.boolean().allow(null).optional()
})

module.exports = {
    validadeUser: (req, res, next) => {
        const { error, value } = userSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }

        req.body = value
        next()
    },

    validadeUserUpdate: (req, res, next) => {
        const { error, value } = newUserSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        
        req.body = value
        next()
    }
}