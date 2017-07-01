'use strict';

var Hexo = require('hexo');
var Promise = require('bluebird');

describe('Hexo douban', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var booksGenerator = Promise.method(require('../lib/books-generator').bind(hexo));
  var moviesGenerator = Promise.method(require('../lib/movies-generator').bind(hexo));

  function locals() {
    hexo.locals.invalidate();
    return hexo.locals.toObject();
  }

  before(function() {
    return hexo.init();
  });

  it('all disabled', function() {
    booksGenerator(locals());
    moviesGenerator(locals());
  });

  it('books enabled', function() {
    hexo.config.douban = {
      user: 'mythsman',
      book: {
        title: 'This is my book title',
        quote: 'This is my book quote'
      }
    };
    booksGenerator(locals());
  });

  it('movies enabled', function() {
    hexo.config.douban = {
      user: 'mythsman',
      movie: {
        title: 'This is my movie title',
        quote: 'This is my movie quote'
      }
    };
    moviesGenerator(locals());
  });

});
