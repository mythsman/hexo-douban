'use strict';

const I18N = require('hexo-i18n');
const urllib = require('urllib');
const pkg = require('../package.json')
const ejs = require("ejs");

module.exports.log = require('hexo-log')({
    debug: false,
    silent: false
});

module.exports.renderFile = (file, data) => {
    return new Promise(resolve => {
        ejs.renderFile(file, data, (err, result) => {
            if (err) {
                module.exports.log.error(err);
                resolve('')
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.syncFetch = async function (url, referer, timeout) {
    try {
        const {data} = await urllib.request(url, {
            method: 'GET',
            timeout: timeout,
            dataType: 'json',
            headers: {
                'User-Agent': `${pkg.name}@${pkg.version}`,
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
    movieDo: 'Watching',
    movieCollect: 'Watched',
    bookWish: 'Wish',
    bookDo: 'Reading',
    bookCollect: 'Read',
    gameWish: 'Wish',
    gameDo: 'Playing',
    gameCollect: 'Played',
    songWish: 'Wish',
    songDo: 'Listening',
    songCollect: 'Listened',
    prev: 'Prev',
    next: 'Next',
    top: 'Top',
    end: 'End'
});

i18n.set('zh-TW', {
    movieWish: '想看',
    movieDo: '在看',
    movieCollect: '已看',
    bookWish: '想讀',
    bookDo: '在讀',
    bookCollect: '已讀',
    gameWish: '想玩',
    gameDo: '在玩',
    gameCollect: '已玩',
    songWish: '想聽',
    songDo: '在聽',
    songCollect: '已聽',
    prev: '上一頁',
    next: '下一頁',
    top: '首頁',
    end: '尾頁'
});

i18n.set('zh-Hans', {
    movieWish: '想看',
    movieDo: '在看',
    movieCollect: '已看',
    bookWish: '想读',
    bookDo: '在读',
    bookCollect: '已读',
    gameWish: '想玩',
    gameDo: '在玩',
    gameCollect: '已玩',
    songWish: '想听',
    songDo: '在听',
    songCollect: '已听',
    prev: '上一页',
    next: '下一页',
    top: '首页',
    end: '尾页'
});

i18n.set('zh-CN', {
    movieWish: '想看',
    movieDo: '在看',
    movieCollect: '已看',
    bookWish: '想读',
    bookDo: '在读',
    bookCollect: '已读',
    gameWish: '想玩',
    gameDo: '在玩',
    gameCollect: '已玩',
    songWish: '想听',
    songDo: '在听',
    songCollect: '已听',
    prev: '上一页',
    next: '下一页',
    top: '首页',
    end: '尾页'
});

module.exports.i18n = i18n;
