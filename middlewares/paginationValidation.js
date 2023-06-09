const Joi = require('joi')

const paginationSchema = Joi.object({
    //username: Joi.string().optional(), // Existem estas duas soluções ou unknown(true) estou usando esta por simplicidade
    limit: Joi.number().integer().min(1).optional(),
    page: Joi.number().integer().min(1).optional(),
}).with("limit", "page").unknown(true)

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