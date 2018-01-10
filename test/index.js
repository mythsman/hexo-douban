'use strict';

var Hexo = require('hexo');
var Promise = require('bluebird');

describe('Hexo douban', function() {
  var hexo = new Hexo(__dirname, {silent: true});
  var booksGenerator = Promise.method(require('../lib/books-generator').bind(hexo));
  var moviesGenerator = Promise.method(require('../lib/movies-generator').bind(hexo));
  var gamesGenerator = Promise.method(require('../lib/games-generator').bind(hexo));

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
    gamesGenerator(locals());
  });

  it('books enabled', function() {
    this.timeout(150000);
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
    this.timeout(150000);
    hexo.config.douban = {
      user: 'mythsman',
      movie: {
        title: 'This is my movie title',
        quote: 'This is my movie quote'
      }
    };
    moviesGenerator(locals());
  });

  it('games enabled', function() {
    this.timeout(150000);
    hexo.config.douban = {
      user: 'mythsman',
      game: {
        title: 'This is my game title',
        quote: 'This is my game quote'
      }
    };
    gamesGenerator(locals());
  });

});
