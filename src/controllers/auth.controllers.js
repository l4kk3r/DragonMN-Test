const mongoose = require('mongoose')
const User = mongoose.model("User")

exports.signup = async ctx => {
    try {
        const userData = ctx.request.body
        
        const userWithSameLogin = await User.findOne({ login: userData.login })
        if (userWithSameLogin) return ctx.status = 403, ctx.body = { success: false, status: 403, message: 'Пользователь с таким логином уже существует' }

        const newUser = new User(userData)
        await newUser.save()

        const response = { message: 'Пользователь успешно создан!' }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}

exports.signin = async ctx => {
    try {
        const { login, password } = ctx.request.body

        const user = await User.findOne({ login }).select("+password")
        if (!user) return ctx.status = 401, ctx.body = { success: false, status: 401, message: 'Пользователь с таким логином и паролем не существует' }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) return ctx.status = 401, ctx.body = { success: false,  status: 401, message: 'Пользователь с таким логином и паролем не существует' }
       
        ctx.session.userId = user._id

        const response = { message: 'Успешный вход' }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}