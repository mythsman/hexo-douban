var request = require('urllib-sync').request;
var ejs=require("ejs")
var xpath=require("xpath")
var dom=require("xmldom").DOMParser
 
module.exports = function(locals){
  var config = this.config;

  var wish_books=[]
  var reading_books=[]
  var read_books=[]

  var wish_movies=[]
  var reading_movies=[]
  var read_movies=[]

  var res = request("https://www.douban.com/feed/people/"+config.douban.user+"/interests", {dataType: 'xml'});
    var doc=new dom().parseFromString(res.data.toString())
    var nodes=xpath.select('//item',doc)
    for(var idx in nodes){

      var node=nodes[idx]

      var title=xpath.select1("string(title)",node);
      var alt=xpath.select1("string(link)",node);
      var recommend=""
      var tags=""
      var comment=""
      var desc=xpath.select1("string(description)",node).replace("</a>","</img></a>")
      var description=new dom().parseFromString(desc)
      var image=xpath.select("string(//@src)",description).replace("ipst","spst")
      var ps=xpath.select("//p",description)

      for (var idp in ps){
        var content=ps[idp].textContent
        switch (content.substr(0,2)){
          case "推荐":
            recommend=content.substr(4)
          break
          case "标签":
            tags=content.substr(4)
          break
          case "备注":
            comment=content.substr(3)
          break
		}
      }
      var item={
        title:title,
        alt:alt,
        image:image,
        recommend:recommend,
        comment:comment,
        tags:tags
      }
      switch(item.title.substr(0,2)){
        case "读过":
          item.title=item.title.substr(2)
          read_books.push(item)
        break
        case "看过":
          item.title=item.title.substr(2)
          read_movies.push(item)
        break
        case "想读":
          item.title=item.title.substr(2)
          wish_books.push(item)
        break
        case "想看":
          item.title=item.title.substr(2)
          wish_movies.push(item)
        break
        case "最近":
          if (item.title.substr(4)=="最近在读"){
            item.title=item.title.substr(4)
            reading_books.push(item)
          }else{
            item.title=item.title.substr(4)
            reading_movies.push(item)
          }
        break
      }
    }
  
  var contents=ejs.renderFile(__dirname+'/template/movie.ejs', {
    'quote':config.douban.movie.quote,
    'reading':reading_movies,
    'wish':wish_movies,
    'read':read_movies
  }, function(err, result) {
    if(err)
      console.log(err)
    return result
  });

  return {
    path: 'movies/index.html',
    data: {title:config.douban.movie.title, content: contents, slug:'movies'},
    layout: 'page'
  };
};
