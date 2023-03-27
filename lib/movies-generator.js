'use strict';

const ejs = require('ejs');
const path = require('path');
const syncFetch = require('./util').syncFetch;
const renderStar = require('./util').renderStar;
const log = require('./util').log;

const i18n = require('./util').i18n;

async function fetchAction(id, action, referer, timeout) {
    let movie = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_movie?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return movie
    }

    let movieResult = response.result
    log.info(movieResult.comment.length + " movies(" + action + ") fetched")
    for (let i in movieResult.comment) {
        let comment = movieResult.comment[i]
        let pubs = []
        if (comment.item.style) {
            pubs.push(comment.item.style)
        }
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
        movie.push({
            title: comment.item.title,
            alt: "https://movie.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return movie
}

async function fetchData(id, referer, timeout) {
    let userResult = await syncFetch("https://mouban.mythsman.com/guest/check_user?id=" + id, referer, timeout)
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

    let wish = await fetchAction(id, 'wish', referer, timeout)
    let dO = await fetchAction(id, 'do', referer, timeout)
    let collect = await fetchAction(id, 'collect', referer, timeout)

    return {
        wish: wish,
        do: dO,
        collect: collect
    }
}

module.exports = async function (locals) {

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

    let item_per_page = 10
    if (config.douban.item_per_page) {
        item_per_page = config.douban.item_per_page
    }

    let meta_max_line = 4
    if (config.douban.meta_max_line) {
        meta_max_line = config.douban.meta_max_line
    }

    const startTime = new Date().getTime();

    let data = await fetchData(config.douban.id, config.url, timeout);

    const endTime = new Date().getTime();

    log.info('movies have been loaded in ' + (endTime - startTime) + " ms");

    const __ = i18n.__(config.language);

    let renderedData = ''
    ejs.renderFile(path.join(__dirname, 'templates/movie.ejs'), {
          'quote': config.douban.movie.quote,
          'wish': data.wish,
          'collect': data.collect,
          'doing': data.do,
          'item_per_page': item_per_page,
          'meta_max_line': meta_max_line,
          '__': __,
          'root': root
      },
      function (err, result) {
          if (err) console.log(err);
          renderedData = result;
      });

    while (renderedData === '') ;

    return {
        path: config.douban.movie.path,
        data: Object.assign({
            title: config.douban.movie.title,
            content: renderedData,
            slug: 'movies'
        }, config.douban.movie.option),
        layout: ['page', 'post']
    };
};
