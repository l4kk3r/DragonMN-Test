const Koa = require('koa')
const koaBody = require('koa-body')
const session = require('koa-session')
const MongooseStore = require("koa-session-mongoose");
require('module-alias/register')

const app = new Koa()

/* GLOBAL VARIABLES */
global.TICKET_PRICE = 30
global.TICKET_PRIZES = [20, 30, 50, 100, 200]

/* APP SETTINGS */
app.keys = [process.env.APP_KEY]
app.use(koaBody())

/* SESSION */
const SESSION_OPTIONS = {
    key: process.env.SESSION_KEY,
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true, 
    signed: false,
    rolling: false,
    renew: false,
    store: new MongooseStore()
}
app.use(session(SESSION_OPTIONS, app));

/* DATABASE */
require('@src/configs/mongodb.config')

/* ROUTES */
const authRoutes = require('@src/routes/auth.routes')
const userRoutes = require('@src/routes/user.routes')
const gameRoutes = require('@src/routes/game.routes')
app.use(authRoutes.routes()).use(authRoutes.allowedMethods())
app.use(userRoutes.routes()).use(userRoutes.allowedMethods())
app.use(gameRoutes.routes()).use(gameRoutes.allowedMethods())

/* APP STARTUP */
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Koa.JS is running on PORT: ${PORT}`))