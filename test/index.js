'use strict';

var Hexo = require('hexo');

describe('Hexo douban', function() {
  var hexo = new Hexo(__dirname, {silent: true});

  before(function() {
    return hexo.init();
  });

});
