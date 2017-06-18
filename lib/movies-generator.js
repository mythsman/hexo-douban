var request = require('urllib-sync').request;
var ejs = require("ejs");
var xpath = require("xpath");
var dom = require("xmldom").DOMParser

function renderStar(num) {
  switch (num) {
  case "1":
    return "★☆☆☆☆ 很差";
  case "2":
    return "★★☆☆☆ 较差";
  case "3":
    return "★★★☆☆ 还行";
  case "4":
    return "★★★★☆ 推荐";
  case "5":
    return "★★★★★ 力荐";
  default:
    return "";
  }
}

function resolv(url) {
  response = request(url, {
    dataType: 'xml'
  });
  var doc = new dom({
    errorHandler: {
      warning: function(e) {},
      error: function(e) {},
      fatalError: function(e) {}
    }
  }).parseFromString(response.data.toString())

  var items = xpath.select('//div[@class="grid-view"]/div[@class="item"]', doc);
  var next = xpath.select('string(//span[@class="next"]/a/@href)', doc);

  var list = []
  for (var i in items) {
    var parser = new dom().parseFromString(items[i].toString());
    var title = xpath.select1("string(//li[@class='title']/a/em)", parser);
    var alt = xpath.select1("string(//li[@class='title']/a/@href)", parser);
    var image = xpath.select1("string(//div[@class='item']/div[@class='pic']/a/img/@src)", parser).replace("ipst", "spst");

    var tags = xpath.select1("string(//li/span[@class='tags'])", parser);
    tags = tags ? tags.substr(3) : '';

    var date = xpath.select1("string(//li/span[@class='date'])", parser);
    date = date ? date: '';

    var recommend = xpath.select1("string(//li/span/@class)", parser);

    recommend = renderStar(recommend.substr(6, 1));
    var comment = xpath.select1("string(//li/span[@class='comment'])", parser);
    comment = comment ? comment: '';

    var info = xpath.select1("string(//li[@class='intro'])", parser);
    info = info ? info: '';

    list.push({
      title: title,
      alt: alt,
      image: image,
      tags: tags,
      date: date,
      recommend: recommend,
      comment: comment,
      info: info,
    })
  }
  return {
    "list": list,
    "next": next
  }
}

module.exports = function(locals) {

  var config = this.config;
  var wish = []
  var watched = []

  var wishUrl = "https://movie.douban.com/people/" + config.douban.user + "/wish"

  for (var next = wishUrl; next;) {
    var res = resolv(next);
    next = res.next;
    wish = wish.concat(res.list);
  }

  var watchedUrl = "https://movie.douban.com/people/" + config.douban.user + "/collect"

  for (var next = watchedUrl; next;) {
    var res = resolv(next);
    next = res.next;
    watched = watched.concat(res.list)
  }

  var contents = ejs.renderFile(__dirname + '/templates/movie.ejs', {
    'quote': config.douban.movie.quote,
    'wish': wish,
    'watched': watched
  },
  function(err, result) {
    if (err) console.log(err);return result;
  });

  return {
    path: 'movies/index.html',
    data: {
      title: config.douban.movie.title,
      content: contents,
      slug: 'movies'
    },
    layout: 'page'
  };
};
