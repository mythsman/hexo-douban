var request = require('urllib-sync').request;
var ejs=require("ejs");
var xpath=require("xpath");
var dom=require("xmldom").DOMParser

function resolv(response){
    var doc=new dom({
      errorHandler:{
        warning:function(e){},
        error:function(e){},
        fatalError:function(e){}}
    }).parseFromString(response.data.toString())

    var items=xpath.select('//div[@class="grid-view"]/div[@class="item"]',doc)

    var list=[]
    for(var i in items){
      var parser=new dom().parseFromString(items[i].toString())
      var title=xpath.select1("string(//li[@class='title']/a/em)",parser);
      var alt=xpath.select1("string(//li[@class='title']/a/@href)",parser);
      var image=xpath.select1("string(//div[@class='item']/div[@class='pic']/a/img/@src)",parser).replace("ipst","spst");


      var tags=xpath.select1("string(//li/span[@class='tags'])",parser);
      tags=tags?tags.substr(3):'';

      var date=xpath.select1("string(//li/span[@class='date'])",parser);
      date=date?date:'';

      var rating=xpath.select1("string(//li/span/@class)",parser);
      switch(rating){
        case "rating1-t":rating="很差";break;
        case "rating2-t":rating="较差";break;
        case "rating3-t":rating="还行";break;
        case "rating4-t":rating="推荐";break;
        case "rating5-t":rating="力荐";break;
      }

      var comment=xpath.select1("string(//li/span[@class='comment'])",parser);
      comment=comment?comment:'';

      var info=xpath.select1("string(//li[@class='intro'])",parser);
      info=info?info:'';

      list.push({
        title:title,
        alt:alt,
        image:image,
        tags:tags,
        date:date,
        rating:rating,
        comment:comment,
        info:info,
     })
   }
   return list
}
 
module.exports = function(locals){

  var config = this.config;
  var wishResponse = request("https://movie.douban.com/people/"+config.douban.user+"/wish", {dataType: 'xml'});
  var watchedResponse = request("https://movie.douban.com/people/"+config.douban.user+"/collect", {dataType: 'xml'});
  
  var contents=ejs.renderFile(__dirname+'/template/movie.ejs', {
    'quote':config.douban.movie.quote,
    'wish':resolv(wishResponse),
    'watched':resolv(watchedResponse)
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
