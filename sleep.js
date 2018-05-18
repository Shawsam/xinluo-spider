const logger = require('./logger')

const sleep = async(times) => {
    logger.info('当前爬虫自动休眠' + times + 'ms');
    await new Promise((resolve) => {
        setTimeout(resolve, times);
    })
    return true;
}

module.exports = sleep