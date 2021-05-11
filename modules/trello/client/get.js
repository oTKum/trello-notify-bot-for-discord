const logger = require('../../utils/logger');

/**
 * TrelloからのGET処理
 * @param _ {Request}
 * @param res {Response}
 */
module.exports = (_, res) => {
    res.sendStatus(200);
    logger.info('GET: ', res);
};
