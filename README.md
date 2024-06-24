# hexo-douban

一个在 [Hexo](https://hexo.io) 页面中嵌入豆瓣个人主页的小插件.

[![package version](https://badge.fury.io/js/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![npm](https://img.shields.io/npm/dt/hexo-douban.svg)](https://www.npmjs.com/package/hexo-douban)
[![GitHub license](https://img.shields.io/github/license/mythsman/hexo-douban.svg)](https://github.com/mythsman/hexo-douban/blob/master/LICENSE)

[![NPM](https://nodei.co/npm/hexo-douban.png)](https://nodei.co/npm/hexo-douban/)

## 原理

hexo-douban 目前升级到了 2.x 版本，将原先由插件客户端自行获取数据的逻辑抽到了一个隐藏的服务端中进行，以统一解决数据获取、数据缓存、风控对抗等问题，提高页面生成的成功率和效率。

## 安装

node 版本要求 >= v18

```bash
$ npm install hexo-douban --save
```

## 配置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件).

### 精简配置

```yaml
douban:
  id: 162448367
  book:
    title: "This is my book title"
  movie:
    title: "This is my movie title"
  game:
    title: "This is my game title"
  song:
    title: "This is my song title"
```

### 完整配置

```yaml
douban:
  id: 162448367
  builtin: false
  dynamic: false
  item_per_page: 10
  meta_max_line: 4
  customize_layout: page
  swup: false
  book:
    path: books/index.html
    title: "This is my book title"
    quote: "This is my book quote"
    actions:
      - do
      - wish
      - collect
    option:
  movie:
    path: movies/index.html
    title: "This is my movie title"
    quote: "This is my movie quote"
    actions:
      - do
      - wish
      - collect
    option:
  game:
    path: games/index.html
    title: "This is my game title"
    quote: "This is my game quote"
    actions:
      - do
      - wish
      - collect
    option:
  song:
    path: songs/index.html
    title: "This is my song title"
    quote: "This is my song quote"
    actions:
      - do
      - wish
      - collect
    option:
```

- **id**: 你的豆瓣 ID(纯数字格式，不是自定义的域名)。获取方法可以参考[怎样获取豆瓣的数字 ID ？](https://www.zhihu.com/question/19634899)
- **builtin**: 是否将`hexo douban`命令默认嵌入进`hexo g`、`hexo s`，使其自动执行`hexo douban` 命令。默认关闭。
- **dynamic**: 豆瓣页面是否在访问时实时请求接口。默认为 false，表示页面信息会在执行 hexo douban 命令时更新，优点是生成的页面不会受到后续接口可用性的影响，确定是需要手动更新。如果设置为 true ，则会在页面访问时实时调用接口进行渲染，无需执行 hexo douban 命令更新页面，但是代价就是如果接口挂了，页面就会寄。
- **item_per_page**: 每页展示的条目数，默认 10 。
- **meta_max_line**: 每个条目展示的详细信息的最大行数，超过该行数则会以 "..." 省略，默认 4 。
- **customize_layout**: 自定义布局文件。默认值为 page 。无特别需要，留空即可。若配置为 `abcd`，则表示指定 `//theme/hexo-theme/layout/abcd.ejs` 文件渲染豆瓣页面。
- **swup**: 是否兼容 [swup](https://swup.js.org/plugins/scripts-plugin/) 。支持 script 热加载，解决一些 single-page 主题的加载问题，默认 false 。
- **path**: 生成页面后的路径，默认生成在 //yourblog/books/index.html 等下面。如需自定义路径，则可以修改这里。
- **title**: 该页面的标题。
- **quote**: 写在页面开头的一段话,支持 html 语法，可以为空。
- **actions**: 一个字符串列表，表示生成的页面中的"已 X"，"想 X","X 过"的标签配置，默认会自动聚焦在第一个标签。可选项为: 'do','wish','collect'。
- **option**: 该页面额外的 Front-matter 配置，参考[Hexo 文档](https://hexo.io/docs/front-matter.html)。无特别需要，留空即可。

如果只想显示某一个页面(比如 movie)，那就把其他的配置项注释掉即可。

## 使用

**展示帮助文档**

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

**主动生成豆瓣页面**

```
$ hexo douban
INFO  Start processing
INFO  0 (wish), 0 (do),0 (collect) game loaded in 729 ms
INFO  0 (wish), 0 (do),20 (collect) song loaded in 761 ms
INFO  2 (wish), 0 (do),136 (collect) book loaded in 940 ms
INFO  30 (wish), 0 (do),6105 (collect) movie loaded in 4129 ms
INFO  Generated: books/index.html
INFO  Generated: movies/index.html
INFO  Generated: games/index.html
INFO  Generated: songs/index.html
```

如果不加参数，那么默认参数为`-bgms`。当然，前提是配置文件中均有这些类型的配置。

**需要注意的是**，通常大家都喜欢用`hexo d`来作为`hexo deploy`命令的简化，但是当安装了`hexo douban`之后，就不能用`hexo d`了，因为`hexo douban`跟`hexo deploy` 的前缀都是`hexo d`。

如果 builtin:false 时，执行 hexo g 之后发现将 douban 生成的页面删除了:

```
INFO  Start processing
INFO  Files loaded in 343 ms
INFO  Deleted: games/index.html
INFO  Deleted: books/index.html
INFO  Deleted: movies/index.html
INFO  Deleted: songs/index.html
```

那么重新执行 hexo clean 一下即可（原因是 db.json 的数据缓存）。

第一次使用 hexo douban 时，后台会异步进行数据获取，一般需要等待一段时间（后台访问你的标记页面）才能查到数据。顺利情况下，平均一个页面会花 10s。

例如如果你有 150 个想读、150 个已读、150 个在读的图书，每页 15 条，则共需要翻 30 页。那么大约需要等待 30\*10/60=5 分钟。如果长时间没有更新（一天以上），请及时提 issue 反馈。

后续如果你的豆瓣数据更新了，hexo douban 同样也会自动进行更新（同样需要等待一段时间才会查到更新数据），不过出于安全考虑，一个用户 id**每半小时至多只会同步一次**。

由于豆瓣本身深分页的 RT 过高（上万条目的翻页 RT 会到 15s 到 60s），为了防止系统同步压力过大，每个用户的每一类条目最多只会同步 1w 条。

如果 dynamic 设置为 true，则每次访问页面时都会向后端自动发起更新请求，无需手动执行 hexo douban 命令。

## 升级

我会不定期更新一些功能或者修改一些 Bug，所以如果想使用最新的特性，可以用下面的方法来更新:

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
  Books: /books #This is your books page
  Movies: /movies #This is your movies page
  Games: /games #This is your games page
  Songs: /songs #This is your songs page
```

## 通用环境

如果有非 hexo 环境的部署需求，则可以考虑以引入静态资源的方式接入 [idouban](https://github.com/mythsman/idouban) 。

## 接口

如果仅仅想对自己的豆瓣数据进行备份，可以尝试使用下面的接口，复用后端维护的数据提取服务 [mouban](https://github.com/mythsman/mouban) ：

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

## 他们在用

下面列举了在不同 hexo 主题下使用插件后的渲染结果，仅供参考。

如果您使用了本插件，也欢迎在 README.md 中提 PR 将您的网站添加进来，供后人参考。

### [hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly)

- [七鳄の学习格 - 生在黑暗，行向光明ヾ(@^▽^@)ノ](https://blog.gmcj0816.top/books/)
- [Ofra Serendipity](https://cmwlvip.github.io/movies/)
- [冰糖盒子 - 冰糖的笔记本](https://cvki.cn/movies/)
- [フサエ·キャンベル·木之下 - 天道酬勤功不唐捐](https://zipblog.top/movies/)
- [个人生活感悟记录](https://www.ensoul.club/books/)
- [week.wiki](https://week.wiki/movies/)
- [CodeRain - 越努力，越幸运](https://code7rain.github.io/movies/)
- [hangzl's Blog - 总之岁月漫长 然而值得等待](https://hangzl.xyz/movies/)
- [Lmx0](https://www.lmx0.top/movies/)
- [老胖叔 - JZ](https://laopangshu.top/movies/)
- [来生拓己 オフィシャルサイト](https://kisugitakumi.net/movies/)
- [果实 o 的博客 - 个人网站](https://www.shengshunyan.xyz/movies/)
- [TFC 的个人博客](https://iqdxa.github.io/movies/)
- [吕小布の博客 - MindCons](https://mindcons.cn/booklist/)
- [Darler Space - 极速翱翔](https://blog.darler.cn/movies/)
- [Evergarden](https://evergarden.moe/books/)
- [现实的延续](https://www.intelland.cn/movies/)
- [Gallifrey 的计算机学习日记 - 个人文章归档](https://gallifrey.asia/)
- [Chen's Blog](https://chenxs.site/)

### [hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)

- [小法进阶](https://imouyang.com/books/)
- [Peiqi Blog](https://jupeiqi.top/books/)

### [hexo-theme-next](https://github.com/theme-next/hexo-theme-next)

- [Lyz's Blog - Never Give Up](https://blog.home999.cc/books)
- [Sitch's Blog](https://sitchzou.com/movies/)

### [hexo-theme-stellar](https://github.com/xaoxuu/hexo-theme-stellar)

- [是非题](https://www.shifeiti.com/about/movies/)
- [MerryJingle](https://blog.pengfeima.cn/movies/)
- [梅园小径](https://www.auntyang.cf/life/doubanmovies/)

### [hexo-theme-volantis](https://github.com/volantis-x/hexo-theme-volantis)

- [老梁有墨](https://www.laoliang.ink/book/)

### [hexo-theme-pure](https://github.com/cofess/hexo-theme-pure)

- [fyupeng](https://lhx.cool/movies/)

### [hexo-theme-icarus](https://github.com/ppoffice/hexo-theme-icarus)

- [There Hello](https://therehello.top/movies/)

### [hexo-theme-fluid](https://github.com/fluid-dev/hexo-theme-fluid)

- [Loststar's blog](https://blog.loststar.tech/movies)
- [MerickBao の博客](https://merickbao.github.io/movies/)

## 免责声明

本项目仅供学习交流使用，不得用于任何商业用途。

数据来源于互联网公开内容，没有获取任何私有和有权限的信息（个人信息等），由此引发的任何法律纠纷与本人无关。

## 反馈

系统刚上线，可能还不够完善。如果大家在使用的过程中数据有问题、或者有什么问题和意见，欢迎随时提 issue。

如果你觉得这个插件很好用，欢迎右上角点下 star ⭐️，表达对作者的鼓励。

如果你想了解数据获的实现方式，可以参考 [mouban](https://github.com/mythsman/mouban) 这个项目。

## Star History

[![Stargazers over time](https://starchart.cc/mythsman/hexo-douban.svg)](https://starchart.cc/mythsman/hexo-douban)

## Lisense

MIT
