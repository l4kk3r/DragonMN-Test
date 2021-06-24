const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = async (ctx, next) => {
    const userId = ctx.session && ctx.session.userId

    if (!userId) return ctx.status = 403, ctx.body = { success: false, status: 403, message: 'Необходимо войти в аккаунт' }

    const userFromDB = await User.findById(userId)

    if (!userFromDB) return ctx.status = 403, ctx.body = { success: false, status: 403, message: 'Неверная сессия или пользователь больше не существует' }

    ctx.request.user = userFromDB

    await next()
}