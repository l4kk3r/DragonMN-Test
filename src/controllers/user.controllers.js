exports.balance = async ctx => {
    try {
        const response = { balance: ctx.request.user.balance }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}