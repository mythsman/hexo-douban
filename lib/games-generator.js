'use strict';

var request = require('urllib-sync').request;
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
	var response = '';
	try {
		response = request(url, {
			timeout: timeout,
			dataType: 'xml'
		});
	} catch (err){
		offline = true;
	}

	if(offline){
		return [];
	}
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

    var items = xpath.select('//div[@class="game-list"]/div[@class="common-item"]', doc);

    var list = [];
    for (var i in items) {
        var parser = new Dom().parseFromString(items[i].toString());
        var title = xpath.select1('string(//div[@class="title"]/a)', parser);
        var alt = xpath.select1('string(//div[@class="title"]/a/@href)', parser);
        var image = xpath.select1('string(//div[@class="pic"]/a/img/@src)', parser);

        var tags = xpath.select1('string(//div[@class="rating-info"]/span[@class="tags"])', parser);
        tags = tags ? tags.substr(3) : '';
        var date = xpath.select1('string(//div[@class="rating-info"]/span[@class="date"])', parser);
        date = date ? date : '';

        var recommend = xpath.select1('string(//div[@class="rating-info"]/span[contains(@class,"allstar")]/@class)', parser);

        recommend = renderStar(recommend.substr(19, 1));

        var comment = xpath.select1('string(//div[@class="content"]/div[not(@class)])', parser);
        comment = comment ? comment : '';

        var info = xpath.select1('string(//div[@class="desc"]/text())', parser);
        info = info ? info : '';
        info = info.replace(/(^\s*)|(\s*$)/g, '');

        //image = 'https://images.weserv.nl/?url=' + image.substr(8, image.length - 8) + '&w=100';

        list.push({
            title: title,
            alt: alt,
            image: image,
            tags: tags,
            date: date,
            recommend: recommend,
            comment: comment,
            info: info
        });
    }

    return list;
}

module.exports = function (locals) {

    var startTime = new Date().getTime();

    var config = this.config;
    if (!config.douban || !config.douban.game) {//当没有输入game信息时，不进行数据渲染。
        return;
    }

    var timeout = 10000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    var rawUrl = 'https://www.douban.com/people/' + config.douban.user + '/games';
    var playedUrl = rawUrl + '?action=collect';
    var playingUrl = rawUrl + '?action=do';
    var wishUrl = rawUrl + '?action=wish';

    var wish = resolv(wishUrl, timeout);
    var played = resolv(playedUrl, timeout);
    var playing = resolv(playingUrl, timeout);

    var endTime = new Date().getTime();

    var offlinePrompt = offline ? ", because you are offline or your network is bad" : "";

    log.info(wish.length + played.length + playing.length + ' games have been loaded in ' + (endTime - startTime) + " ms" + offlinePrompt);

    var __ = i18n.__(config.language);

    var contents = ejs.renderFile(path.join(__dirname, 'templates/game.ejs'), {
            'quote': config.douban.game.quote,
            'wish': wish,
            'played': played,
            'playing': playing,
            '__': __
        },
        function (err, result) {
            if (err) console.log(err);
            return result;
        });

    return {
        path: 'games/index.html',
        data: {
            title: config.douban.game.title,
            content: contents,
            slug: 'games'
        },
        layout: ['page', 'post']
    };
};
