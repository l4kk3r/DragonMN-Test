const RateLimit = require('koa2-ratelimit').RateLimit;
 
module.exports = RateLimit.middleware({
    message: 'Слишком много запросов к данному ресурсу',
    interval: { min: 2 }, 
    max: 5, 
});