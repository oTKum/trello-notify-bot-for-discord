const fetch     = require('node-fetch');
const TrelloApi = require('../../trello/TrelloApi');
const logger    = require('../../utils/logger');

require('dotenv').config();

const {
          TRELLO_ID_LABEL_PG, TRELLO_ID_LEADER,
          TRELLO_ID_PG_LEADER, DISCORD_WEBHOOK_URL
      } = process.env;

const MEMBERS = JSON.parse(process.env.MEMBERS);

/**
 * DiscordへのPOSTを行う
 * @param action {{}} TrelloのJSONオブジェクト
 * @returns {Promise<void>}
 */
module.exports = async (action) => {
    let mentions = MEMBERS[TRELLO_ID_LEADER];

    // 変更者がPGリーダーではなく
    if (action.memberCreator.id !== TRELLO_ID_PG_LEADER) {
        // PGラベルがある場合、DiscordのメンションにPGリーダーを追加
        await TrelloApi.get('card', action.data.card.id, { 'fields': 'labels' })
                       .then(data => {
                           if (data.labels.every(v => v.id !== TRELLO_ID_LABEL_PG)) return null;

                           mentions += ` ${MEMBERS[TRELLO_ID_PG_LEADER]}`;
                       });
    }

    // 各種情報を解析
    const targetCardName = action.data.card.name;
    const listFrom       = action.data.listBefore.name;
    const listTo         = action.data.listAfter.name;
    const workersDiscord = MEMBERS[action.memberCreator.id];
    const timestamp      = action.date;
    const fullName       = action.memberCreator.fullName;
    const userUrl        = TrelloApi.getUserUrl(action.memberCreator.username);
    const userIconUrl    = action.memberCreator.avatarUrl + '/170.png';
    const targetCardUrl  = TrelloApi.getShortUrl(action.data.card.shortLink);

    const eCard = '<:trello_card:842003076906614784>';
    const eList = '<:trello_list:842003103100174336>';

    const embed = {
        content: `${mentions} ${eCard} **${targetCardName}** が ${eList} **${listFrom}** から ${eList} **${listTo}** に移動されました。確認をお願いします。`,
        embeds : [{
            description: `(${workersDiscord})`,
            color      : 31167,
            timestamp  : timestamp,
            author     : {
                name    : fullName,
                url     : userUrl,
                icon_url: userIconUrl
            },
            fields     : [
                {
                    name : '**対象カード**',
                    value: `${eCard} [${targetCardName}](${targetCardUrl})`
                },
                {
                    name  : '**移動前のリスト**',
                    value : `${eList} ${listFrom}`,
                    inline: true
                },
                {
                    name  : '**→**',
                    value : '\u200B',
                    inline: true
                },
                {
                    name  : '**移動後のリスト**',
                    value : `${eList} ${listTo}`,
                    inline: true
                }
            ]
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body   : JSON.stringify(embed)
    })
        .then(res => logger.info('POST to Discord'))
        .catch(err => logger.error('Error: ', err));
};
