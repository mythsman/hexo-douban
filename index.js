'use strict';
var assign = require('object-assign');

hexo.config.douban = assign({
	per_page: typeof hexo.config.per_page === "undefined" ? 10 : hexo.config.per_page
}, hexo.config.douban);

hexo.extend.generator.register('books', require('./lib/generate-books'));
//hexo.extend.generator.register('movies', require('./lib/generate-movies'));
