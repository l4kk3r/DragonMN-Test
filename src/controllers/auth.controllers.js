const mongoose = require('mongoose')
const User = mongoose.model("User")

exports.signup = async ctx => {
    try {
        const userData = ctx.request.body
        
        const userWithSameLogin = await User.findOne({ login: userData.login })
        if (userWithSameLogin) return ctx.status = 403, ctx.body = { message: 'Пользователь с таким логином уже существует' }

        const newUser = new User(userData)
        await newUser.save()

        ctx.body = { message: 'Пользователь успешно создан!' }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}

exports.signin = async ctx => {
    try {
        const { login, password } = ctx.request.body

        const user = await User.findOne({ login }).select("+password")
        if (!user) return ctx.status = 401, ctx.body = { message: 'Пользователь с таким логином и паролем не существует' }

        const isPasswordCorrect = await user.comparePassword(password)
        if (!isPasswordCorrect) return ctx.status = 401, ctx.body = { message: 'Пользователь с таким логином и паролем не существует' }
       
        ctx.session.userId = user._id

        ctx.body = { message: 'Успешный вход' }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}