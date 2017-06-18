var request = require('urllib-sync').request;
var ejs = require("ejs");

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

function callApi(user, start) {
  var wish = [];
  var reading = [];
  var read = [];
  var res = request("https://api.douban.com/v2/book/user/" + user + "/collections?start=" + start + "&count=100", {
    dataType: 'json'
  });
  for (var i in res.data.collections) {
    var book = res.data.collections[i]
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
      comment: (book.comment ? book.comment: '')
    }
    if (book.status == "wish") {
      wish.push(item)
    } else if (book.status == "read") {
      read.push(item)
    } else if (book.status == "reading") {
      reading.push(item)
    }
  }
  return {
    "wish": wish,
    "reading": reading,
    "read": read,
    "start": res.data.start,
    "count": res.data.count,
    "total": res.data.total
  }
}

module.exports = function(locals) {
  var config = this.config;

  var wish = [];
  var reading = [];
  var read = [];

  var res;
  var start = 0;
  do {
    res = callApi(config.douban.user, start);
    wish = wish.concat(res.wish);
    reading = reading.concat(res.reading);
    read = read.concat(res.read);
    start = res.start + res.count;
  } while ( start < res . total );

  var contents = ejs.renderFile(__dirname + '/templates/book.ejs', {
    'quote': config.douban.book.quote,
    'reading': reading,
    'wish': wish,
    'read': read
  },
  function(err, result) {
    if (err) console.log(err); return result;
  });

  return {
    path: 'books/index.html',
    data: {
      title: config.douban.book.title,
      content: contents,
      slug: 'books'
    },
    layout: 'page'
  };
};
