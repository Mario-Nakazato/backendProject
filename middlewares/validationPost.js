const Joi = require('joi')

const postSchema = Joi.object({
    title: Joi.string().max(64).allow('').optional(),
    content: Joi.string().max(2048).allow('').optional(),
}).min(1).unknown(true)

const newPostSchema = Joi.object({
    newTitle: Joi.string().max(64).allow('').optional(),
    newContent: Joi.string().max(2048).allow('').optional(),
})

module.exports = {
    validadePost: (req, res, next) => {
        const { error, value } = postSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        req.body = value
        next()
    },

    validadePostUpdate: (req, res, next) => {
        const { error, value } = newPostSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        req.body = value
        next()
    }
}