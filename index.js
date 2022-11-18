/* global hexo */
'use strict';
const fs = require('hexo-fs');
const path = require('path');
const log = require('./lib/util').log

const options = {
    options: [
        {name: '-b, --books', desc: 'Generate douban books only'},
        {name: '-m, --movies', desc: 'Generate douban movies only'},
        {name: '-g, --games', desc: 'Generate douban games only'}
    ]
};

hexo.extend.console.register('douban', 'Generate pages from douban', options, function (args) {
    const names = [];

    if ((args.b || args.books) && this.config.douban.book) {
        names.push("books");
    }
    if ((args.m || args.movies) && this.config.douban.movie) {
        names.push("movies");
    }
    if ((args.g || args.games) && this.config.douban.game) {
        names.push("games");
    }

    if (names.length === 0) {
        if (this.config.douban.book) {
            names.push("books");
        }
        if (this.config.douban.movie) {
            names.push("movies");
        }
        if (this.config.douban.game) {
            names.push("games");
        }
    }
    const self = this;

    //Register route
    names.forEach(name => {
        let page_path = self.config.douban[name.substr(0, name.length - 1)].path || name + "/index.html"
        if (page_path.startsWith("/")) {
            page_path = page_path.substr(1)
        }
        self.config.douban[name.substr(0, name.length - 1)].path = page_path

        hexo.extend.generator.register(name, require('./lib/' + name + '-generator'));

        log.info("page_path :" + page_path)
    })


    //Generate files
    self.load().then(function () {
        names.forEach(name => {
            const publicDir = self.public_dir;
            const id = self.config.douban[name.substr(0, name.length - 1)].path
            fs.mkdirSync(path.join(publicDir, id.replace("index.html", "")), {recursive: true})

            self.route.get(id) && self.route.get(id)._data().then(function (contents) {
                fs.writeFile(path.join(publicDir, id), contents);
                log.info("Generated: %s", id);
            });
        });
    });
});
