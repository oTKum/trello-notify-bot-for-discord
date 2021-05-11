const fetch = require('node-fetch');

require('dotenv').config();

const { TRELLO_KEY, TRELLO_TOKEN } = process.env;

class TrelloApi {
    static _urlBase;
    static _apiUrlBase;
    static _shortUrlBase;

    constructor() {
        TrelloApi._urlBase      = 'https://trello.com/';
        TrelloApi._apiUrlBase   = 'https://api.trello.com/1/';
        TrelloApi._shortUrlBase = `${TrelloApi._urlBase}c/`;
    }

    static _getFetch(url) {
        return fetch(url, {
            method : 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    /**
     * TrelloAPIにGETリクエストを送信する
     * @param target {string} リクエストするAPIの名称
     * @param id {string} リクエストする対象のID
     * @param urlParams {{}} パラメータ
     * @returns {Promise<any | void>}
     */
    get(target, id, urlParams = {}) {
        const url    = TrelloApi._apiUrlBase + `${target}/${id}`;
        const params = new URLSearchParams({ key: TRELLO_KEY, token: TRELLO_TOKEN, ...urlParams }).toString();

        return TrelloApi._getFetch(`${url}?${params}`)
                        .then(res => res.json())
                        .catch(err => console.error(err));
    }

    /**
     * ユーザーページへのURLを取得する
     * @param username {string} 対象のユーザー名
     * @returns {string}
     */
    getUserUrl(username) {
        return TrelloApi._urlBase + username;
    }

    /**
     * カードへの短縮URLを取得する
     * @param link {string} 対象カードのショートリンク
     * @returns {string}
     */
    getShortUrl(link) {
        return TrelloApi._shortUrlBase + link;
    }
}

module.exports = new TrelloApi();
