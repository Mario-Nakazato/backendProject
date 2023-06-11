const Joi = require('joi')

const profileSchema = Joi.object({
    fullName: Joi.string().min(2).allow('').optional(),
    bio: Joi.string().max(256).allow('').optional(),
}).min(1).unknown(true)

const newProfileSchema = Joi.object({
    newFullName: Joi.string().min(2).allow('').optional(),
    newBio: Joi.string().max(256).allow('').optional(),
})

module.exports = {
    validadeProfile: (req, res, next) => {
        const { error, value } = profileSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }

        req.body = value
        next()
    },

    validadeProfileUpdate: (req, res, next) => {
        const { error, value } = newProfileSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        
        req.body = value
        next()
    }
}