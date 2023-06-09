const Joi = require('joi')

const paginationSchema = Joi.object({
    limit: Joi.number().integer().min(1).required(),
    page: Joi.number().integer().min(1).required(),
}).with("limit", "page")

module.exports = {
    validadePagination: (req, res, next) => {
        const { error, value } = paginationSchema.validate(req.query)

        if (error) {
            console.error("Erro de validação: ", error.details)
            return res.status(400).json({ error: "Dados inválidos" })
        }
        req.query = value
        next()
    },
}