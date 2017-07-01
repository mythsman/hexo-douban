'use strict';

module.exports.renderStar = function(num) {
  switch (num) {
  case '1':
    return '★☆☆☆☆ 很差';
  case '2':
    return '★★☆☆☆ 较差';
  case '3':
    return '★★★☆☆ 还行';
  case '4':
    return '★★★★☆ 推荐';
  case '5':
    return '★★★★★ 力荐';
  default:
    return '';
  }
};

