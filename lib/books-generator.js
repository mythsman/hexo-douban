'use strict';

var urllib = require('urllib')
var ejs = require('ejs');
var xpath = require('xpath');
var path = require('path');
var Dom = require('xmldom').DOMParser;
var renderStar = require('./util').renderStar;
var i18n = require('./util').i18n;
var offline = false;

var log = require('hexo-log')({
    debug: false,
    silent: false
});

function resolv(url, timeout) {
    return new Promise((resolve, reject) => {
        var response = '';
        urllib.request(url, {
            method: 'GET',
            timeout: timeout,
            headers: {
                referer: 'https://book.douban.com/chart',
                host: 'book.douban.com',
                "user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
            }
        }).then(result =>  {
            response = result.res;
            var doc = new Dom({
                errorHandler: {
                    warning: function (e) {
                    },

                    error: function (e) {
                    },

                    fatalError: function (e) {
                    }
                }
            }).parseFromString(response.data.toString());
            var items = xpath.select('//ul[@class="interest-list"]/li[@class="subject-item"]', doc);

            var next = xpath.select('string(//span[@class="next"]/a/@href)', doc);
            if (next.startsWith("/")) {
                next = "https://book.douban.com" + next;
            }

            var list = [];
            for (var i in items) {
                var parser = new Dom().parseFromString(items[i].toString());
                var title = xpath.select1('string(//div[@class="info"]/h2/a/@title)', parser);
                var alt = xpath.select1('string(//div[@class="info"]/h2/a/@href)', parser);
                var image = xpath.select1('string(//div[@class="pic"]/a/img/@src)', parser);

                var pub = xpath.select1('string(//div[@class="pub"])', parser);

                var updated = xpath.select1('string(//span[@class="date"])', parser);

                var tags = xpath.select1('string(//span[@class="tags"])', parser);
                tags = tags ? tags.substr(3) : '';

                var recommend = xpath.select1('string(//div[@class="short-note"]/div/span[contains(@class,"rating")]/@class)', parser);
                recommend = renderStar(recommend.substr(6, 1));
                var comment = xpath.select1('string(//p[@class="comment"])', parser);
                comment = comment ? comment : '';

                //image = 'https://images.weserv.nl/?url=' + image.substr(8, image.length - 8) + '&w=100';

                list.push({
                    title: title,
                    alt: alt,
                    image: image,
                    pub:pub,
                    updated:updated,
                    tags: tags,
                    recommend: recommend,
                    comment: comment
                });
            }

            resolve({
                list: list,
                next: next
            });

        }).catch(_ => {
            offline = 1;
            resolve({
                list: [],
                next: ""
            });
        });
    });
}

module.exports = async function (locals) {

    var config = this.config;
    if (!config.douban || !config.douban.book) {//当没有输入book信息时，不进行数据渲染。
        return;
    }

    var root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    var timeout = 10000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    var startTime = new Date().getTime();
    var wish = [];
    var read = [];
    var reading = [];
    var headers = {
        'Cookie': []
    };

    var wishUrl = 'https://book.douban.com/people/' + config.douban.user + '/wish';

    for (var nextWish = wishUrl; nextWish;) {
        await resolv(nextWish, timeout).then(resWish => {
            nextWish = resWish.next;
            wish = wish.concat(resWish.list);
        });
    }

    var readingUrl = 'https://book.douban.com/people/' + config.douban.user + '/do';

    for (var nextreading = readingUrl; nextreading;) {
        await resolv(nextreading, timeout).then(resreading => {
            nextreading = resreading.next;
            reading = reading.concat(resreading.list);
        });
    }


    var readUrl = 'https://book.douban.com/people/' + config.douban.user + '/collect';

    for (var nextread = readUrl; nextread;) {
        await resolv(nextread, timeout).then(resread => {
            nextread = resread.next;
            read = read.concat(resread.list);
        });
    }

    var endTime = new Date().getTime();

    var offlinePrompt = offline ? ", because you are offline or your network is bad" : "";

    log.info(wish.length + read.length + ' books have been loaded in ' + (endTime - startTime) + " ms" + offlinePrompt);

    var __ = i18n.__(config.language);

    var contents = ejs.renderFile(path.join(__dirname, 'templates/book.ejs'), {
        'quote': config.douban.book.quote,
        'wish': wish,
        'read': read,
        'reading': reading,
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
