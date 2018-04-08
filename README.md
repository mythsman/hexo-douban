# hexo-douban

一个在 [Hexo](https://hexo.io) 页面中嵌入豆瓣个人主页的小插件.

[![npm](https://img.shields.io/npm/v/npm.svg)](https://nodejs.org/en/)
[![Build Status](https://travis-ci.org/mythsman/hexo-douban.svg?branch=master)](https://travis-ci.org/mythsman/hexo-douban)
[![Coverage Status](https://coveralls.io/repos/github/mythsman/hexo-douban/badge.svg?branch=master)](https://coveralls.io/github/mythsman/hexo-douban?branch=master)
[![NPM version](https://badge.fury.io/js/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![npm](https://img.shields.io/npm/dt/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f894cc232ae54ba8893af54a1cf587f5)](https://www.codacy.com/app/mythsman/hexo-douban?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mythsman/hexo-douban&amp;utm_campaign=Badge_Grade)
[![GitHub license](https://img.shields.io/github/license/mythsman/hexo-douban.svg)](https://github.com/mythsman/hexo-douban/blob/master/LICENSE)


## 安装

``` bash
$ npm install hexo-douban --save
```

## 设置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件).

``` yaml
douban:
  user: mythsman
  book:
    title: 'This is my book title'
    quote: 'This is my book quote'
  movie:
    title: 'This is my movie title'
    quote: 'This is my movie quote'
  game:
    title: 'This is my game title'
    quote: 'This is my game quote'
  timeout: 10000 #optional
```

- **user**: 你的豆瓣ID.打开豆瓣，登入账户，然后在右上角点击 "个人主页" ，就可以在这个URL里看到你的ID了: "https://www.douban.com/people/xxxxxx/".
- **title**: 该页面的标题.
- **quote**: 写在页面开头的一段话,支持html语法.
- **timeout**: 爬取数据的超时时间，默认是 10000ms ,如果在使用时发现报了超时的错(ETIMEOUT)可以把这个数据设置的大一点。

如果只想显示某一个页面(比如movie)，那就把其他的配置项注释掉即可。


## 升级
我会不定期更新一些功能或者修改一些Bug，所以如果想使用最新的特性，可以用下面的方法来更新:

```
$ npm update hexo-douban --save
```

## 显示
如果上面的配置都没问题，就可以在生成站点之后打开 `//yourblog/books` 和 `//yourblog/movies`, `//yourblog/games`, 来查看结果.

## 菜单
如果上面的显示没有问题就可以在主题的配置文件 `_config.yml` 里添加如下配置来为这些页面添加菜单链接.
```yaml
menu:
  Home: /
  Archives: /archives
  Books: /books     #This is your books page
  Movies: /movies   #This is your movies page
  Games: /games   #This is your games page
```

## 更新记录
0.2.14
- 修复了firefox下反防盗链失败的问题.......

0.2.13
- 修复了断网情况下报错导致无法继续生成页面的bug

0.2.12
- 添加图片懒加载的特性，减少首次加载时间
- 添加no-referrer的属性，反防盗链:)

0.2.11
- 修复了ejs@2.5.8版本出现非向下兼容的更新导致的异常

0.2.10
- 修复了页面在firefox浏览器打开时弹出about:blank的bug

0.2.9
- 紧急修复了由于豆瓣对前端代码做了简单重构导致的插件爬取电影信息异常的bug

0.2.8
- 为标签添加国际化设置，支持zh-Hans,zh-tw,en等
- 考虑到某些剧比较长，存在"在看"这个状态，因此为movie页添加"在看"标签

0.2.7
- 修复页面显示不正常的bug

0.2.6
- 添加分页效果
- 重构模板代码

0.2.5
- 修复无法适配某些主题的bug

## 截图
我们在下面这些常见的主题里测试了插件的使用效果:

### hexo-theme-landscape
![landscape](screenshot/landscape.png)

### hexo-theme-next
![next](screenshot/next.png)

### hexo-theme-yilia
![yilia](screenshot/yilia.png)

### hexo-theme-indigo
![indigo](screenshot/indigo.png)

### hexo-theme-aath
![aath](screenshot/aath.png)

## 在线Demo

[books](https://blog.mythsman.com/books?from=hexo-douban)

[movies](https://blog.mythsman.com/movies?from=hexo-douban)

[games](https://blog.mythsman.com/games?from=hexo-douban)

## FeedBack
如果大家在使用的过程中有什么问题或者意见，欢迎随时提issue。

## Lisense
MIT
