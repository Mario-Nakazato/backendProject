const Joi = require('joi')

const commentSchema = Joi.object({
    content: Joi.string().max(2048).allow('').optional(),
}).unknown(true)

const newCommentSchema = Joi.object({
    newContent: Joi.string().max(2048).allow('').optional(),
})

module.exports = {
    validadeComment: (req, res, next) => {
        const { error, value } = commentSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }

        req.body = value
        next()
    },

    validadeCommentUpdate: (req, res, next) => {
        const { error, value } = newCommentSchema.validate(req.body)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }

        req.body = value
        next()
    }
}