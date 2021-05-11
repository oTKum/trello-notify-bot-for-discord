const moment         = require('moment');
const discordHandler = require('../../discord/handler');
const logger         = require('../../utils/logger');

require('dotenv').config();

const { TRELLO_ID_BOARD, TRELLO_ID_LIST_PENDING } = process.env;

/**
 * TrelloからのPOST処理
 * @param req {Request}
 * @param res {Response}
 */
module.exports = async (req, res) => {
    res.sendStatus(200);

    logger.info('POST from Trello');

    const action = req.body.action;

    // 10秒以内の操作のみ処理（再送による重複対策）
    if (moment().diff(moment(action.date), 's') > 10) return;

    // 指定ボードの操作のみ処理
    if (action.data.board.id !== TRELLO_ID_BOARD) return;

    // カード移動時のみ処理
    if (action.type !== 'updateCard' ||
        !(action.type === 'updateCard' && action.display.translationKey === 'action_move_card_from_list_to_list')) {
        return;
    }

    // 完了確認リストへの移動時のみ処理
    if (action.data.listAfter.id !== TRELLO_ID_LIST_PENDING) return;

    // 諸々JSONを解析し、DiscordにPOST
    await discordHandler.post(action);
};
