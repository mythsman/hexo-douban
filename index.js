/* global hexo */
'use strict';
const fs = require('hexo-fs');
const path = require('path');
const log = require('./lib/util').log

const supported_types = ['book', 'movie', 'game', 'song']

// Register `hexo g` and `hexo s`
supported_types.forEach(supported_type => {
    hexo.extend.generator.register(`${supported_type}s`, function (locals) {
        if (!this.config.douban || !this.config.douban[supported_type] || !this.config.douban.builtin) {
            return;
        }
        if (!this.config.douban[supported_type].path) {
            this.config.douban[supported_type].path = `${supported_type}s/index.html`
        }

        if (this.config.douban[supported_type].path.startsWith("/")) {
            this.config.douban[supported_type].path = this.config.douban[type].path.substr(1)
        }

        locals.douban_type = supported_type
        return require(`./lib/generator`).call(this, locals);
    });
})

const options = {
    options: [
        { name: '-b, --books', desc: 'Generate douban books only' },
        { name: '-m, --movies', desc: 'Generate douban movies only' },
        { name: '-g, --games', desc: 'Generate douban games only' },
        { name: '-s, --songs', desc: 'Generate douban songs only' }
    ]
}

// Register `hexo douban`
hexo.extend.console.register('douban', 'Generate pages from douban', options, function (args) {

    if (!this.config.douban) {
        log.info("No douban config specified")
        return
    }
    if (!this.config.douban.id) {
        log.info("No douban id specified")
        return
    }


    let force_types = []
    supported_types.forEach(supported_type => {
        if ((args[supported_type[0]] || args[`${supported_type}s`]) && this.config.douban[supported_type]) {
            force_types.push(supported_type)
        }
    })

    let enabled_types = [];

    if (force_types.length !== 0) {
        enabled_types = force_types
    } else {
        supported_types.forEach(type => {
            if (this.config.douban[type]) {
                enabled_types.push(type);
            }
        })
    }

    if (enabled_types.length === 0) {
        log.info("No douban type specified")
        return
    }

    // Prepare path
    enabled_types.forEach(type => {
        if (!this.config.douban[type].path) {
            this.config.douban[type].path = `${type}s/index.html`
        }

        if (this.config.douban[type].path.startsWith("/")) {
            this.config.douban[type].path = this.config.douban[type].path.substr(1)
        }

        hexo.extend.generator.register(type, function (locals) {
            locals.douban_type = type
            return require(`./lib/generator`).call(this, locals)
        });
    })

    const self = this;

    //Generate files
    self.load().then(function () {
        enabled_types.forEach(enabled_type => {
            const publicDir = self.public_dir;
            const id = self.config.douban[enabled_type].path
            fs.mkdirSync(path.join(publicDir, id.replace("index.html", "")), { recursive: true })

            let stream = self.route.get(id)
            if (stream) {
                self.route.get(id).pipe(fs.createWriteStream(path.join(publicDir, id)));
                log.info("Generated: %s", id);
            }
        });
    });
});
