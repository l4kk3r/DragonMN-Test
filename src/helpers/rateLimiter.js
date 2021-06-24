const RateLimit = require('koa2-ratelimit').RateLimit;
 
module.exports = RateLimit.middleware({
    message: 'Слишком много запросов к данному ресурсу',
    interval: { sec: 30 }, 
    max: 5, 
});
