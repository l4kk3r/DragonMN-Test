const mongoose = require('mongoose')
const User = mongoose.model("User")
const Ticket = mongoose.model("Ticket")
const createTickets = require('@src/helpers/createTickets')


exports.buyTickets = async ctx => {
    try {
        const user = ctx.request.user
        const { count } = ctx.request.body
    
        const ticketWorh = count * TICKET_PRICE
    
        if (ticketWorh > user.balance) return ctx.status = 400, ctx.body = { success: false, status: 400, message: 'Не хватает средств на приобретение билетов' }
    
        await Promise.all([
            createTickets(count, user._id),
            User.findByIdAndUpdate(user._id, { $inc: { balance: -ticketWorh } })
        ])
        
        const response = { message: 'Билеты успешно созданы' }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}

exports.openCell = async ctx => {
    try {
        const user = ctx.request.user
        const { _id, cell } = ctx.request.body
    
        const ticket = await Ticket.findById(_id)
    
        if (!ticket || !ticket.owner.equals(user._id)) return ctx.status = 403, ctx.body = { success: false, status: 403, message: 'У вас нет доступа к данному билету' }
    
        if (ticket.status === 'ended') return ctx.status = 400, ctx.body = { success: false, status: 400, message: 'Данный билет уже завершён' }
    
        if (ticket.cells[cell].status === 'opened') return ctx.status = 400, ctx.body = { success: false, status: 400, message: 'Данная клетка уже открыта' }
    
        if (ticket.status === 'new') await Ticket.findByIdAndUpdate(_id, { status: 'active', [`cells.${cell}.status`]: 'opened' })
        if (ticket.status === 'active') await Ticket.findByIdAndUpdate(_id, { [`cells.${cell}.status`]: 'opened' })
    
        const response = { message: 'Клетка открыта' }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}

exports.getState = async ctx => {
    try {
        const user = ctx.request.user

        const tickets = await Ticket.find({ owner: user._id, status: {$in: ['new', 'active'] }}).sort({ updatedAt: -1 })
    
        const currentTicket = tickets.length > 0 ? tickets[0] : null

        const response = { activeTicketsNumber: tickets.length, currentTicket }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}

exports.endTicket = async ctx => {
    try {
        const user = ctx.request.user
        const { _id } = ctx.request.body

        const ticket = await Ticket.findById(_id)
    
        if (!ticket || !ticket.owner.equals(user._id)) return ctx.status = 403, ctx.body = { success: false, status: 403, message: 'У вас нет доступа к данному билету' }
    
        if (ticket.status === 'ended') return ctx.status = 400, ctx.body = { success: false, status: 400, message: 'Данный билет уже завершён' }
    
        const hasClosedCell = ticket.cells.some(cell => cell.status === 'closed')
    
        if (hasClosedCell) return ctx.status = 400, ctx.body = { success: false, status: 400, message: 'Не все клетки стёрты' }
    
        await Promise.all([
            Ticket.findByIdAndUpdate(_id, { status: 'ended' }),
            User.findByIdAndUpdate(user._id, { $inc: { balance: ticket.prize } })
        ])

        const response = { message: `Билет успешно закрыт. Выигрыш (${ticket.prize} монет) зачислен пользователю` }
        ctx.body = { success: true, response }
    } catch (e) {
        console.log(e)
        ctx.status = 500
        ctx.body = { success: false, status: 500, message: 'Iternal Server Error' }
    }
}