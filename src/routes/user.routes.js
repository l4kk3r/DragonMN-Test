const Router = require('koa-router')

const router = new Router({
    prefix: '/api'
})

const userControllers = require('@src/controllers/user.controllers')
const authRequiredMiddleware = require('@src/middlewares/authRequired')

router.get('/balance', authRequiredMiddleware, userControllers.balance)

module.exports = router