exports.balance = async ctx => {
    try {
        ctx.body = { balance: ctx.request.user.balance }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}