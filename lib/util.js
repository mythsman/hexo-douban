'use strict';

const I18N = require('hexo-i18n');
const urllib = require('urllib');

module.exports.log = require('hexo-log')({
    debug: false,
    silent: false
});

module.exports.syncFetch = async function (url, referer, timeout) {
    try {
        const {data} = await urllib.request(url, {
            method: 'GET',
            timeout: timeout,
            dataType: 'json',
            headers: {
                'User-Agent': 'hexo-douban',
                'Referer': referer
            }
        })
        return data
    } catch (err) {
        module.exports.log.error(err)
        return 'OFFLINE'
    }
}

module.exports.renderStar = function (num) {
    switch (num) {
        case '1':
            return '★☆☆☆☆ 很差';
        case '2':
            return '★★☆☆☆ 较差';
        case '3':
            return '★★★☆☆ 还行';
        case '4':
            return '★★★★☆ 推荐';
        case '5':
            return '★★★★★ 力荐';
        default:
            return '';
    }
};


let i18n = new I18N({
    languages: ['zh-CN', 'en']
});

i18n.set('en', {
    movieWish: 'Wish',
    movieWatched: 'Watched',
    movieWatching: 'Watching',
    bookWish: 'Wish',
    bookRead: 'Read',
    bookReading: 'Reading',
    gamePlayed: 'Played',
    gamePlaying: 'Playing',
    gameWish: 'Wish',
    songListened: 'Listened',
    songListening: 'Listening',
    songWish: 'Wish',
    prev: 'Prev',
    next: 'Next',
    top: 'Top',
    end: 'End'
});

i18n.set('zh-TW', {
    movieWish: '想看',
    movieWatched: '已看',
    movieWatching: '在看',
    bookWish: '想讀',
    bookRead: '已讀',
    bookReading: '在讀',
    gamePlayed: '已玩',
    gamePlaying: '在玩',
    gameWish: '想玩',
    songListened: '已聽',
    songListening: '在聽',
    songWish: '想聽',
    prev: '上一頁',
    next: '下一頁',
    top: '首頁',
    end: '尾頁'
});

i18n.set('zh-Hans', {
    movieWish: '想看',
    movieWatched: '已看',
    movieWatching: '在看',
    bookWish: '想读',
    bookRead: '已读',
    bookReading: '在读',
    gamePlayed: '已玩',
    gamePlaying: '在玩',
    gameWish: '想玩',
    songListened: '已听',
    songListening: '在听',
    songWish: '想听',
    prev: '上一页',
    next: '下一页',
    top: '首页',
    end: '尾页'
});

i18n.set('zh-CN', {
    movieWish: '想看',
    movieWatched: '已看',
    movieWatching: '在看',
    bookWish: '想读',
    bookRead: '已读',
    bookReading: '在读',
    gamePlayed: '已玩',
    gamePlaying: '在玩',
    gameWish: '想玩',
    songListened: '已听',
    songListening: '在听',
    songWish: '想听',
    prev: '上一页',
    next: '下一页',
    top: '首页',
    end: '尾页'
});

module.exports.i18n = i18n;
