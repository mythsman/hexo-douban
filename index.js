/* global hexo */
'use strict';
var fs = require('hexo-fs');
var path = require('path');

hexo.extend.generator.register('books', require('./lib/books-generator'));
hexo.extend.generator.register('movies', require('./lib/movies-generator'));
hexo.extend.generator.register('games', require('./lib/games-generator'));

hexo.extend.generator.register('douban-gif', function (locals) {
  return {
    path: '/assets/douban-loading.gif',
    data: function () {
      return fs.createReadStream(path.join(__dirname, '/lib/templates/douban-loading.gif'));
    }
  };
});
