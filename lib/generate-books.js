var request = require('urllib-sync').request;
var ejs=require("ejs")
var fs=require('hexo-fs')  
  
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
      tags:book.tags,
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
  var ret=fs.readFileSync('node_modules/hexo-douban/lib/book.ejs')
  var contents=ejs.render(ret.toString(),{
    'quote':config.douban.quote,
    'reading':reading,
    'wish':wish,
    'read':read
  })

  return {
    path: 'douban/index.html',
    data: {title:config.douban.title, content: contents, slug:'douban'},
    layout: 'post'
  };
};
