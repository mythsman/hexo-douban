'use strict';

var request = require('urllib-sync').request;
var path = require('path');
var ejs = require('ejs');
var renderStar = require('./util').renderStar;
var i18n = require('./util').i18n;
var offline = false;

var log = require('hexo-log')({
    debug: false,
    silent: false
});

function callApi(user, start, timeout) {
    var wish = [];
    var reading = [];
    var read = [];
    var res = '';
    try {
        res = request('https://api.douban.com/v2/book/user/' + user + '/collections?start=' + start + '&count=100', {
            timeout: timeout,
            dataType: 'json'
        });
    } catch (err) {
        offline = true;
    }

    if (offline) {
        return {
            'wish': wish,
            'reading': reading,
            'read': read,
            'start': 0,
            'count': 0,
            'total': 0
        };
    }

    for (var i in res.data.collections) {
        var book = res.data.collections[i];
        var item = {
            image: book.book.image,
            alt: book.book.alt,
            author: book.book.author,
            title: book.book.title,
            pubdate: book.book.pubdate,
            publisher: book.book.publisher,
            tags: (book.tags ? book.tags.join(' ') : ''),
            updated: book.updated.substring(0, 10),
            rating: book.book.rating.average,
            recommend: (book.rating ? renderStar(book.rating.value) : ''),
            comment: (book.comment ? book.comment : '')
        };
        if (book.status === 'wish') {
            wish.push(item);
        } else if (book.status === 'read') {
            read.push(item);
        } else if (book.status === 'reading') {
            reading.push(item);
        }
    }

    return {
        'wish': wish,
        'reading': reading,
        'read': read,
        'start': res.data.start,
        'count': res.data.count,
        'total': res.data.total
    };
}

module.exports = function (locals) {
    var config = this.config;
    if (!config.douban || !config.douban.book) {//当没有输入book信息时，不进行数据渲染。
        return;
    }

    var timeout = 10000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    var root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    var startTime = new Date().getTime();

    var wish = [];
    var reading = [];
    var read = [];

    var res;
    var start = 0;
    do {
        res = callApi(config.douban.user, start, timeout);
        wish = wish.concat(res.wish);
        reading = reading.concat(res.reading);
        read = read.concat(res.read);
        start = res.start + res.count;
    } while (start < res.total);

    var endTime = new Date().getTime();

    var offlinePrompt = offline ? ", because you are offline or your network is bad" : "";

    log.info(reading.length + wish.length + read.length + ' books have been loaded in ' + (endTime - startTime) + " ms" + offlinePrompt);

    var __ = i18n.__(config.language);

    var contents = ejs.renderFile(path.join(__dirname, '/templates/book.ejs'), {
        'quote': config.douban.book.quote,
        'reading': reading,
        'wish': wish,
        'read': read,
        '__': __,
        'root': root
    },
        function (err, result) {
            if (err) console.log(err);
            return result;
        });

    return {
        path: 'books/index.html',
        data: {
            title: config.douban.book.title,
            content: contents,
            slug: 'books'
        },
        layout: ['page', 'post']
    };
};
