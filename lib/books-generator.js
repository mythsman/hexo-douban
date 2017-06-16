var request = require('urllib-sync').request;
var ejs=require("ejs")
 
module.exports = function(locals){
  var config = this.config;

  var wish=[]
  var reading=[]
  var read=[]

  var res = request("https://api.douban.com/v2/book/user/"+config.douban.user+"/collections", {dataType: 'json'});
  for(var i in res.data.collections ){
    var book=res.data.collections[i]
    var item={
      image:book.book.image,
      alt:book.book.alt,
      author:book.book.author,
      title:book.book.title,
      pubdate:book.book.pubdate,
      publisher:book.book.publisher,
      tags:book.tags.join(' '),
      updated:book.updated.substring(0,10),
      rating:book.book.rating.average,
      comment:(book.comment?book.comment:'')
    }
    if (book.status=="wish"){
      wish.push(item)
    }else if(book.status=="read"){
      read.push(item)
    }else if(book.status=="reading"){
      reading.push(item)
    }
  }
  var contents=ejs.renderFile('node_modules/hexo-douban/lib/template/book.ejs', {
    'quote':config.douban.book.quote,
    'reading':reading,
    'wish':wish,
    'read':read
  }, function(err, result) {
    if(err)
      console.log(err)
    return result
  });

  return {
    path: 'books/index.html',
    data: {title:config.douban.book.title, content: contents, slug:'books'},
    layout: 'page'
  };
};
