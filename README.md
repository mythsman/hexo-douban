# hexo-douban

douban plugin for [Hexo](https://hexo.io).

[![npm](https://img.shields.io/npm/v/npm.svg)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/mythsman/hexo-douban.svg?branch=master)](https://travis-ci.org/mythsman/hexo-douban)
[![Coverage Status](https://coveralls.io/repos/github/mythsman/hexo-douban/badge.svg?branch=master)](https://coveralls.io/github/mythsman/hexo-douban?branch=master)
[![NPM version](https://badge.fury.io/js/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![npm](https://img.shields.io/npm/dt/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![Package quality](http://packagequality.com/shield/hexo-douban.svg)](http://packagequality.com/#?package=hexo-douban)


## Installation

``` bash
$ npm install hexo-douban --save
```

## Options

You should copy the following text to the bottom of  `_config.yml` of your blog.

``` yaml
douban:
  user: mythsman
  book:
    title: 'This is my book title'
    quote: 'This is my book quote'
  movie:
    title: 'This is my movie title'
    quote: 'This is my movie quote'
```

- **user**: Your douban Id . You can see it from the url of your douban homepage.For example, you should click on your "个人主页" and you can see your id from the url "https://www.douban.com/people/xxxxxx/".
- **title**: Your title in that page.
- **quote**: Your quote in that page.

## Show
If all the above is done , you can now check `http://yourblog/books` and `http://yourblog/movies` , and you will see the result.

## Menu
If all the above is done , you can add them to the `_config.yml` of your theme like this:
```yaml
menu:
  Home: /
  Archives: /archives
  Books: /books     #This is your books page
  Movies: /movies   #This is your movies page
```

## Screenshot
We just test the plugin in the following three themes.

### hexo-theme-landscape
![landscape](screenshot/landscape.png)

### hexo-theme-next
![next](screenshot/next.png)

### hexo-theme-yilia
![yilia](screenshot/yilia.png)

## Online demo

[books](https://blog.mythsman.com/books?from=hexo-douban)

[movies](https://blog.mythsman.com/movies?from=hexo-douban)

## Lisense
MIT
