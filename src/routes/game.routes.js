const Router = require('koa-router')

const router = new Router({
    prefix: '/api/game'
})

const gameControllers = require('@src/controllers/game.controllers')
const gameValidators = require('@src/validators/game.validators')
const authRequiredMiddleware = require('@src/middlewares/authRequired')

router.post('/', authRequiredMiddleware, gameValidators.buyTickets, gameControllers.buyTickets)
router.post('/cell', authRequiredMiddleware, gameValidators.openCell, gameControllers.openCell)
router.get('/state', authRequiredMiddleware, gameControllers.getState)
router.post('/end', authRequiredMiddleware, gameValidators.endTicket, gameControllers.endTicket)

module.exports = router