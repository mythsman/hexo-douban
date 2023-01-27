# hexo-douban

一个在 [Hexo](https://hexo.io) 页面中嵌入豆瓣个人主页的小插件.

[![npm](https://img.shields.io/npm/v/npm.svg)](https://nodejs.org/en/)
[![package version](https://badge.fury.io/js/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![npm](https://img.shields.io/npm/dt/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![GitHub license](https://img.shields.io/github/license/mythsman/hexo-douban.svg)](https://github.com/mythsman/hexo-douban/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/hexo-douban.png)](https://nodei.co/npm/hexo-douban/)

## 原理
hexo-douban 目前升级到了 2.x 版本，将原先由插件客户端自行获取数据的逻辑抽到了一个隐藏的服务端中进行，以统一解决数据获取、数据缓存、风控对抗等问题，提高页面生成的成功率和效率。

## 安装

``` bash
$ npm install hexo-douban --save
```

## 配置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件).

``` yaml
douban:
  id: 162448367
  builtin: false
  book:
    path: books/index.html
    title: 'This is my book title'
    quote: 'This is my book quote'
    option:
  movie:
    path: movies/index.html
    title: 'This is my movie title'
    quote: 'This is my movie quote'
    option:
  game:
    path: games/index.html
    title: 'This is my game title'
    quote: 'This is my game quote'
    option:
  song:
    path: songs/index.html
    title: 'This is my song title'
    quote: 'This is my song quote'
    option:
  timeout: 10000 
```

- **id**: 你的豆瓣ID(纯数字格式，不是自定义的域名)。获取方法可以参考[怎样获取豆瓣的数字 ID ？](https://www.zhihu.com/question/19634899)
- **builtin**: 是否将`hexo douban`命令默认嵌入进`hexo g`、`hexo s`，使其自动执行`hexo douban` 命令。默认关闭。当你的豆瓣条目较多时，也建议关闭。
- **path**: 生成页面后的路径，默认生成在 //yourblog/books/index.html 等下面。如需自定义路径，则可以修改这里。
- **title**: 该页面的标题。
- **quote**: 写在页面开头的一段话,支持html语法。
- **option**: 该页面额外的 Front-matter 配置，参考[Hexo 文档](https://hexo.io/docs/front-matter.html)。无特别需要，留空即可。
- **timeout**: 爬取数据的超时时间，默认是 10000ms ,如果在使用时发现报了超时的错(ETIMEOUT)可以把这个数据设置的大一点。

如果只想显示某一个页面(比如movie)，那就把其他的配置项注释掉即可。

## 使用
```
$ hexo douban -h
Usage: hexo douban

Description:
Generate pages from douban

Options:
  -b, --books   Generate douban books only
  -g, --games   Generate douban games only
  -m, --movies  Generate douban movies only
  -s, --songs   Generate douban songs only
```
如果不加参数，那么默认参数为`-bgms`。当然，前提是配置文件中均有这些类型的配置。

**需要注意的是**，通常大家都喜欢用`hexo d`来作为`hexo deploy`命令的简化，但是当安装了`hexo douban`之后，就不能用`hexo d`了，因为`hexo douban`跟`hexo deploy`的前缀都是`hexo d`。

第一次使用 hexo douban 时，后台会异步进行数据获取，一般需要等待一段时间（后台访问你的标记页面）才能查到数据。顺利情况下，平均一个页面会花10s。

例如如果你有 150 个想读、150个已读、150个在读的图书，每页15条，则共需要翻30页。那么大约需要等待 30*10/60=5 分钟。如果长时间没有更新，请及时提 issue 反馈。

后续如果你的豆瓣数据更新了，hexo douban 同样也会自动进行更新（同样需要等待一段时间才会查到更新数据），不过出于安全考虑，一个用户id**每小时至多只会同步一次**。


由于数据获取的策略原因，目前数据只支持新增，不支持删除。也就是说，即使你在豆瓣中删除了某个“想看”，这里同步到的数据中仍然包含这个条目。


## 升级
我会不定期更新一些功能或者修改一些Bug，所以如果想使用最新的特性，可以用下面的方法来更新:

1. 修改 package.json 内 hexo-douban 的版本号至最新
2. 重新安装最新版本`npm install hexo-douban --save`

或者使用`npm install hexo-douban --update --save`直接更新。

## 显示
如果上面的配置和操作都没问题，就可以在生成站点之后打开 `//yourblog/books` 和 `//yourblog/movies`, `//yourblog/games`, 来查看结果。

## 菜单
如果上面的显示没有问题就可以在主题的配置文件 `_config.yml` 里添加如下配置来为这些页面添加菜单链接.
```yaml
menu:
  Home: /
  Archives: /archives
  Books: /books     #This is your books page
  Movies: /movies   #This is your movies page
  Games: /games   #This is your games page
  Songs: /songs   #This is your songs page
```
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

## 接口
如果有非hexo环境的部署需求（例如我自己就是用的 Ghost ，简单效果页:[豆瓣](https://blog.mythsman.com/douban)），或者仅仅想对自己的豆瓣数据进行备份，可以尝试使用下面的接口，复用后端维护的数据提取服务 [mouban](https://github.com/mythsman/mouban)：


```
# 将 {your_douban_id} 改为你的豆瓣数字ID

# 用户录入/更新

https://mouban.mythsman.com/guest/check_user?id={your_douban_id}

# 查询用户的读书评论

https://mouban.mythsman.com/guest/user_book?id={your_douban_id}&action=wish

https://mouban.mythsman.com/guest/user_book?id={your_douban_id}&action=do

https://mouban.mythsman.com/guest/user_book?id={your_douban_id}&action=collect

# 查询用户的电影评论

https://mouban.mythsman.com/guest/user_movie?id={your_douban_id}&action=wish

https://mouban.mythsman.com/guest/user_movie?id={your_douban_id}&action=do

https://mouban.mythsman.com/guest/user_movie?id={your_douban_id}&action=collect

# 查询用户的游戏评论

https://mouban.mythsman.com/guest/user_game?id={your_douban_id}&action=wish

https://mouban.mythsman.com/guest/user_game?id={your_douban_id}&action=do

https://mouban.mythsman.com/guest/user_game?id={your_douban_id}&action=collect

# 查询用户的音乐评论

https://mouban.mythsman.com/guest/user_song?id={your_douban_id}&action=wish

https://mouban.mythsman.com/guest/user_song?id={your_douban_id}&action=do

https://mouban.mythsman.com/guest/user_song?id={your_douban_id}&action=collect
```

## 免责声明
本项目仅供学习交流使用，不得用于任何商业用途。

数据来源于互联网公开内容，没有获取任何私有和有权限的信息（个人信息等），由此引发的任何法律纠纷与本人无关。

## 反馈
系统刚上线，可能还不够完善。如果大家在使用的过程中数据有问题、或者有什么问题和意见，欢迎随时提issue。如果你觉得这个插件很好用，欢迎右上角点下小✨～

## Lisense
MIT
