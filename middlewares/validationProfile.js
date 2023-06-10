const Joi = require('joi')

const profileSchema = Joi.object({
    fullName: Joi.string().min(2).optional(),
    bio: Joi.string().max(256).optional(),
}).min(1).unknown(true)

module.exports = {
    validadeProfile: (req, res, next) => {
        const { error, value } = profileSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        req.body = value
        next()
    }
}