'use strict';

var should = require('chai').should(); // eslint-disable-line
var Promise = require('bluebird');
var Hexo = require('hexo');

describe('Hexo douban', function() {
  var hexo = new Hexo(__dirname, {silent: true});

  function locals() {
    hexo.locals.invalidate();
    return hexo.locals.toObject();
  }

  before(function() {
    return hexo.init();
  });

});
