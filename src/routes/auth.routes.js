const Router = require('koa-router')

const router = new Router({
    prefix: '/api'
})

const authControllers = require('@src/controllers/auth.controllers')
const authValidators = require('@src/validators/auth.validators')
const rateLimiter = require('@src/helpers/rateLimiter')

router.post('/signup', authValidators.signup, authControllers.signup)
router.post('/signin', rateLimiter, authValidators.signin, authControllers.signin)

module.exports = router