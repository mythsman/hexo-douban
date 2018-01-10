/* global hexo */
'use strict';

hexo.extend.generator.register('books', require('./lib/books-generator'));
hexo.extend.generator.register('movies', require('./lib/movies-generator'));
hexo.extend.generator.register('games', require('./lib/games-generator'));
