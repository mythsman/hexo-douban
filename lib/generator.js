'use strict';

const path = require('path');
const http = require('./http')
const log = require('./util').log;
const renderFile = require('./util').renderFile;
const i18n = require('./util').i18n;

module.exports = async function (locals) {

    const type = locals.douban_type
    const config = this.config;
    if (!config.douban || !type || !config.douban[type]) {//当没有输入信息时，不进行数据渲染。
        return;
    }

    let root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    let timeout = 10000;
    if (config.douban.timeout) {
        timeout = config.douban.timeout;
    }

    let item_per_page = 10
    if (config.douban.item_per_page) {
        item_per_page = config.douban.item_per_page
    }

    let meta_max_line = 4
    if (config.douban.meta_max_line) {
        meta_max_line = config.douban.meta_max_line
    }
    
    let customize_layout = 'page'
    if (config.douban.customize_layout) {
        customize_layout = config.douban.customize_layout
    }

    const startTime = new Date().getTime();

    let data = await http.fetchData(config.douban.id, config.url, type, timeout);

    const endTime = new Date().getTime();

    log.info(`${data.wish.length} (wish), ${data.do.length} (do),${data.collect.length} (collect) ${type} loaded in ${endTime - startTime} ms`);

    const __ = i18n.__(config.language);

    return renderFile(path.join(__dirname, 'templates/index.ejs'), {
        quote: config.douban[type].quote,
        wish: data.wish,
        collect: data.collect,
        dO: data.do,
        item_per_page: item_per_page,
        meta_max_line: meta_max_line,
        type: `${type}`,
        __: __,
        root: root
    }).then(renderedData => {
        return {
            path: config.douban[type].path,
            data: Object.assign({
                title: config.douban[type].title,
                content: renderedData,
                slug: `${type}s`
            }, config.douban[type].option),
            layout: [customize_layout, 'post']
        };
    })
};
