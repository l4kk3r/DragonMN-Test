const Joi = require('joi')

const joiOptions = {
    stripUnknown: true, // удаление ненужных полей
    abortEarly: true // остановка после первой ошибки
}

const buyTicketsSchema = Joi.object({
    count: Joi.number().min(1).max(10).required()
})

const openCellSchema = Joi.object({
    _id: Joi.string().required(),
    cell: Joi.number().min(0).max(8).required()
})

const endTicketSchema = Joi.object({
    _id: Joi.string().required()
})

exports.buyTickets = async (ctx, next) => {
    const { value, error } = buyTicketsSchema.validate(ctx.request.body, joiOptions)

    if (error) return ctx.status = 422, ctx.body = { success: false, message: error.details[0].message }

    ctx.request.body = value
    await next()
}

exports.openCell = async (ctx, next) => {
    const { value, error } = openCellSchema.validate(ctx.request.body, joiOptions)

    if (error) return ctx.status = 422, ctx.body = { success: false, message: error.details[0].message }

    ctx.request.body = value
    await next()
}

exports.endTicket = async (ctx, next) => {
    const { value, error } = endTicketSchema.validate(ctx.request.body, joiOptions)

    if (error) return ctx.status = 422, ctx.body = { success: false, message: error.details[0].message }

    ctx.request.body = value
    await next()
}