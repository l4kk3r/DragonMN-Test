const mongoose = require('mongoose')
const User = mongoose.model("User")
const Ticket = mongoose.model("Ticket")
const createTickets = require('@src/helpers/createTickets')


exports.buyTickets = async ctx => {
    try {
        const user = ctx.request.user
        const { count } = ctx.request.body
    
        const ticketWorh = count * TICKET_PRICE
    
        if (ticketWorh > user.balance) return ctx.status = 400, ctx.body = { message: 'Не хватает средств на приобретение билетов' }
    
        await createTickets(count, user._id)
    
        await User.findByIdAndUpdate(user._id, { $inc: { balance: -ticketWorh } })
    
        ctx.body = { message: 'Билеты успешно созданы' }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}

exports.openCell = async ctx => {
    try {
        const user = ctx.request.user
        const { _id, cell } = ctx.request.body
    
        const ticket = await Ticket.findById(_id)
    
        if (!ticket || !ticket.owner.equals(user._id)) return ctx.status = 403, ctx.body = { message: 'У вас нет доступа к данному билету' }
    
        if (ticket.status === 'ended') return ctx.status = 400, ctx.body = { message: 'Данный билет уже завершён' }
    
        if (ticket.cells[cell].status === 'opened') return ctx.status = 400, ctx.body = { message: 'Данная клетка уже открыта' }
    
        if (ticket.status === 'new') await Ticket.findByIdAndUpdate(_id, { status: 'active', [`cells.${cell}.status`]: 'opened' })
        if (ticket.status === 'active') await Ticket.findByIdAndUpdate(_id, { [`cells.${cell}.status`]: 'opened' })
    
        ctx.body = { message: 'Клетка открыта' }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}

exports.getState = async ctx => {
    try {
        const user = ctx.request.user

        const tickets = await Ticket.find({ owner: user._id, status: {$in: ['new', 'active'] }}).sort({ updatedAt: -1 })
    
        const currentTicket = tickets.length > 0 ? tickets[0] : null
    
        ctx.body = { activeTicketsNumber: tickets.length, currentTicket }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}

exports.endTicket = async ctx => {
    try {
        const user = ctx.request.user
        const { _id } = ctx.request.body

        const ticket = await Ticket.findById(_id)
    
        if (!ticket || !ticket.owner.equals(user._id)) return ctx.status = 403, ctx.body = { message: 'У вас нет доступа к данному билету' }
    
        if (ticket.status === 'ended') return ctx.status = 400, ctx.body = { message: 'Данный билет уже завершён' }
    
        const hasClosedCell = ticket.cells.some(cell => cell.status === 'closed')
    
        if (hasClosedCell) return ctx.status = 400, ctx.body = { message: 'Не все клетки стёрты' }
    
        await Ticket.findByIdAndUpdate(_id, { status: 'ended' })
        await User.findByIdAndUpdate(user._id, { $inc: { balance: ticket.prize } })
    
        ctx.body = { message: `Билет успешно закрыт. Выигрыш (${ticket.prize} монет) зачислен пользователю` }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { message: 'Iternal Server Error' }
    }
}