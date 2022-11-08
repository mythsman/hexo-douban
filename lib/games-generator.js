'use strict';

const ejs = require('ejs');
const path = require('path');
const syncFetch = require('./util').syncFetch;
const renderStar = require('./util').renderStar;
const log = require('./util').log;

const i18n = require('./util').i18n;

function fetchAction(id, action, referer, timeout) {
    let game = []
    let response = syncFetch("https://mouban.mythsman.com/guest/user_game?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return game
    }

    let gameResult = response.result
    log.info(gameResult.comment.length + " games(" + action + ") fetched")
    for (let i in gameResult.comment) {
        let comment = gameResult.comment[i]
        let pubs = []
        if (comment.item.platform) {
            pubs.push(comment.item.platform)
        }
        if (comment.item.genre) {
            pubs.push(comment.item.genre)
        }
        if (comment.item.developer) {
            pubs.push(comment.item.developer)
        }
        if (comment.item.publisher) {
            pubs.push(comment.item.publisher)
        }
        let meta = []
        if (comment.mark_date) {
            meta.push(comment.mark_date)
        }
        if (comment.label) {
            meta.push(comment.label)
        }
        if (comment.rate) {
            meta.push(renderStar(comment.rate + ''))
        }
        game.push({
            title: comment.item.title,
            alt: "https://www.douban.com/game/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / ").substr(0, 100),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return game
}

function fetchData(id, referer, timeout) {
    let userResult = syncFetch("https://mouban.mythsman.com/guest/check_user?id=" + id, referer, timeout)
    if (userResult === "OFFLINE") {
        log.warn("Cannot connect to server")
        return {
            wish: [],
            do: [],
            collect: []
        }
    }
    if (!userResult.success) {
        log.warn(userResult.msg)
        return {
            wish: [],
            do: [],
            collect: []
        }
    }

    let wish = fetchAction(id, 'wish', referer, timeout)
    let dO = fetchAction(id, 'do', referer, timeout)
    let collect = fetchAction(id, 'collect', referer, timeout)

    return {
        wish: wish,
        do: dO,
        collect: collect
    }
}

module.exports = function (locals) {

    const config = this.config;
    if (!config.douban || !config.douban.game) {//当没有输入game信息时，不进行数据渲染。
        return;
    }

    let root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    let timeout = 10000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    const startTime = new Date().getTime();

    let data = fetchData(config.douban.id, config.url, timeout);

    const endTime = new Date().getTime();

    log.info('games have been loaded in ' + (endTime - startTime) + " ms");

    const __ = i18n.__(config.language);

    let renderedData = ''
    ejs.renderFile(path.join(__dirname, 'templates/game.ejs'), {
            'quote': config.douban.game.quote,
            'wish': data.wish,
            'collect': data.collect,
            'doing': data.do,
            '__': __,
            'root': root
        },
        function (err, result) {
            if (err) console.log(err);
            renderedData = result;
        });

    while (renderedData === '') ;

    return {
        path: 'games/index.html',
        data: {
            title: config.douban.game.title,
            content: renderedData,
            slug: 'games'
        },
        layout: ['page', 'post']
    };
};
