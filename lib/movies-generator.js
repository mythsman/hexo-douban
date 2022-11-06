'use strict';

const ejs = require('ejs');
const path = require('path');
const syncFetch = require('./util').syncFetch;
const renderStar = require('./util').renderStar;
const log = require('./util').log;

const i18n = require('./util').i18n;

function fetchAction(id, action, timeout) {
    let movie = []
    let response = syncFetch("http://mouban.mythsman.com/guest/user_movie?action=" + action + "&id=" + id, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return movie
    }

    let movieResult = response.result
    log.info(movieResult.comment.length + " movies(" + action + ") fetched")
    for (let i in movieResult.comment) {
        let comment = movieResult.comment[i]
        let pubs = []
        if (comment.item.director) {
            pubs.push(comment.item.director)
        }
        if (comment.item.writer) {
            pubs.push(comment.item.writer)
        }
        if (comment.item.actor) {
            pubs.push(comment.item.actor)
        }
        if (comment.item.publish_date) {
            pubs.push(comment.item.publish_date)
        }
        movie.push({
            title: comment.item.title,
            alt: "https://movie.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub:pubs.join(" / ").substr(0, 100),
            updated: comment.mark_date,
            tags: comment.label,
            recommend: renderStar(comment.rate + ''),
            comment: comment.comment
        })
    }
    return movie
}

function fetchData(id, timeout) {
    let userResult = syncFetch("http://mouban.mythsman.com/guest/check_user?id=" + id, timeout)
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

    let wish = fetchAction(id, 'wish', timeout)
    let dO = fetchAction(id, 'do', timeout)
    let collect = fetchAction(id, 'collect', timeout)

    return {
        wish: wish,
        do: dO,
        collect: collect
    }
}

module.exports = function (locals) {

    const config = this.config;
    if (!config.douban || !config.douban.movie) {//当没有输入movie信息时，不进行数据渲染。
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

    let data = fetchData(config.douban.id, timeout);

    const endTime = new Date().getTime();

    log.info('movies have been loaded in ' + (endTime - startTime) + " ms");

    const __ = i18n.__(config.language);

    let renderedData = ''
    ejs.renderFile(path.join(__dirname, 'templates/movie.ejs'), {
            'quote': config.douban.movie.quote,
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
        path: 'movies/index.html',
        data: {
            title: config.douban.movie.title,
            content: renderedData,
            slug: 'movies'
        },
        layout: ['page', 'post']
    };
};
