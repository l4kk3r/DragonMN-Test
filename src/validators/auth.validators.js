const Joi = require('joi')

const joiOptions = {
    stripUnknown: true, // удаление ненужных полей
    abortEarly: true // остановка после первой ошибки
}

const signupSchema = Joi.object({
    login: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().min(6).max(20).required(),
})

const signinSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required(),
})

exports.signup = async (ctx, next) => {
    const { value, error } = signupSchema.validate(ctx.request.body, joiOptions)

    if (error) return ctx.status = 422, ctx.body = { success: false, message: error.details[0].message }

    ctx.request.body = value
    await next()
}

exports.signin = async (ctx, next) => {
    const { value, error } = signinSchema.validate(ctx.request.body, joiOptions)

    if (error) return ctx.status = 422, ctx.body = { success: false, message: error.details[0].message }

    ctx.request.body = value
    await next()
}