'use strict';

const ejs = require('ejs');
const path = require('path');
const syncFetch = require('./util').syncFetch;
const renderStar = require('./util').renderStar;
const log = require('./util').log;

const i18n = require('./util').i18n;

async function fetchAction(id, action, referer, timeout) {
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
            pub: pubs.join(" / ").substr(0, 500),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return song
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
    if (!config.douban || !config.douban.song) {//当没有输入song信息时，不进行数据渲染。
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

    let data = await fetchData(config.douban.id, config.url, timeout);

    const endTime = new Date().getTime();

    log.info('songs have been loaded in ' + (endTime - startTime) + " ms");

    const __ = i18n.__(config.language);

    let renderedData = ''
    ejs.renderFile(path.join(__dirname, 'templates/song.ejs'), {
          'quote': config.douban.song.quote,
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
        path: config.douban.song.path,
        data: Object.assign({
            title: config.douban.song.title,
            content: renderedData,
            slug: 'songs'
        }, config.douban.song.option),
        layout: ['page', 'post']
    };
};
