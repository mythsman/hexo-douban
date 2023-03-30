'use strict';

const ejs = require('ejs');
const path = require('path');
const syncFetch = require('./util').syncFetch;
const renderStar = require('./util').renderStar;
const log = require('./util').log;

const i18n = require('./util').i18n;

async function fetchAction(id, action, referer, type, timeout) {
    switch (type) {
        case 'book':
            return fetchBook(id, action, referer, timeout);
        case 'movie':
            return fetchMovie(id, action, referer, timeout);
        case 'game':
            return fetchGame(id, action, referer, timeout);
        case 'song':
            return fetchSong(id, action, referer, timeout);
        default:
            throw new Error(`${type} type not found`)
    }
}


async function fetchBook(id, action, referer, timeout) {
    let book = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_book?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return book
    }

    let bookResult = response.result
    log.info(bookResult.comment.length + " books(" + action + ") fetched")

    for (let i in bookResult.comment) {
        let comment = bookResult.comment[i]
        let pubs = []
        if (comment.item.author) {
            pubs.push(comment.item.author)
        }
        if (comment.item.translator) {
            pubs.push(comment.item.translator)
        }
        if (comment.item.press) {
            pubs.push(comment.item.press)
        }
        if (comment.item.producer) {
            pubs.push(comment.item.producer)
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
        book.push({
            title: comment.item.title,
            alt: "https://book.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return book
}


async function fetchGame(id, action, referer, timeout) {
    let game = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_game?action=" + action + "&id=" + id, referer, timeout)
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
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return game
}


async function fetchSong(id, action, referer, timeout) {
    let song = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_song?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return song
    }

    let songResult = response.result
    log.info(songResult.comment.length + " songs(" + action + ") fetched")
    for (let i in songResult.comment) {
        let comment = songResult.comment[i]
        let pubs = []
        if (comment.item.alias) {
            pubs.push(comment.item.alias)
        }
        if (comment.item.musician) {
            pubs.push(comment.item.musician)
        }
        if (comment.item.album_type) {
            pubs.push(comment.item.album_type)
        }
        if (comment.item.genre) {
            pubs.push(comment.item.genre)
        }
        if (comment.item.media) {
            pubs.push(comment.item.media)
        }
        if (comment.item.publisher) {
            pubs.push(comment.item.publisher)
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
        song.push({
            title: comment.item.title,
            alt: "https://music.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return song
}


async function fetchMovie(id, action, referer, timeout) {
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

async function fetchData(id, referer, type, timeout) {
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

    let wish = await fetchAction(id, 'wish', referer, type, timeout)
    let dO = await fetchAction(id, 'do', referer, type, timeout)
    let collect = await fetchAction(id, 'collect', referer, type, timeout)

    return {
        wish: wish,
        do: dO,
        collect: collect
    }
}

module.exports = async function (locals) {

    const type = locals.douban_type
    const config = this.config;
    if (!config.douban || !type || !config.douban[type]) {//当没有输入信息时，不进行数据渲染。
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

    let data = await fetchData(config.douban.id, config.url, type, timeout);

    const endTime = new Date().getTime();

    log.info(`${type} have been loaded in ${endTime - startTime} ms`);

    const __ = i18n.__(config.language);

    let renderedData = ''
    ejs.renderFile(path.join(__dirname, 'templates/index.ejs'), {
          quote: config.douban[type].quote,
          wish: data.wish,
          collect: data.collect,
          dO: data.do,
          item_per_page: item_per_page,
          meta_max_line: meta_max_line,
          type: `${type}`,
          __: __,
          root: root
      },
      function (err, result) {
          if (err) console.log(err);
          renderedData = result;
      });

    while (renderedData === '') ;

    return {
        path: config.douban.book.path,
        data: Object.assign({
            title: config.douban.book.title,
            content: renderedData,
            slug: `${type}s`
        }, config.douban.book.option),
        layout: ['page', 'post']
    };
};
