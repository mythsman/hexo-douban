const {syncFetch, log, renderStar} = require("./util");

module.exports.fetchAction = async function (id, action, referer, type, timeout) {
    switch (type) {
        case 'book':
            return this.fetchBook(id, action, referer, timeout);
        case 'movie':
            return this.fetchMovie(id, action, referer, timeout);
        case 'game':
            return this.fetchGame(id, action, referer, timeout);
        case 'song':
            return this.fetchSong(id, action, referer, timeout);
        default:
            throw new Error(`${type} type not found`)
    }
}


module.exports.fetchBook = async function (id, action, referer, timeout) {
    let book = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_book?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return book
    }

    let bookResult = response.result

    for (let i in bookResult.comment) {
        let comment = bookResult.comment[i]
        let pubs = []
        if (comment.item.author) {
            pubs.push(comment.item.author)
        }
        if (comment.item.translator) {
            pubs.push(comment.item.translator)
        }
        if (comment.item.press) {
            pubs.push(comment.item.press)
        }
        if (comment.item.producer) {
            pubs.push(comment.item.producer)
        }

        let meta = []
        if (comment.mark_date) {
            meta.push(comment.mark_date)
        }
        if (comment.label) {
            meta.push(comment.label)
        }
        if (comment.rate) {
            meta.push(renderStar(comment.rate + ''))
        }
        book.push({
            title: comment.item.title,
            alt: "https://book.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return book
}


module.exports.fetchGame = async function (id, action, referer, timeout) {
    let game = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_game?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return game
    }

    let gameResult = response.result
    for (let i in gameResult.comment) {
        let comment = gameResult.comment[i]
        let pubs = []
        if (comment.item.platform) {
            pubs.push(comment.item.platform)
        }
        if (comment.item.genre) {
            pubs.push(comment.item.genre)
        }
        if (comment.item.developer) {
            pubs.push(comment.item.developer)
        }
        if (comment.item.publisher) {
            pubs.push(comment.item.publisher)
        }
        let meta = []
        if (comment.mark_date) {
            meta.push(comment.mark_date)
        }
        if (comment.label) {
            meta.push(comment.label)
        }
        if (comment.rate) {
            meta.push(renderStar(comment.rate + ''))
        }
        game.push({
            title: comment.item.title,
            alt: "https://www.douban.com/game/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return game
}


module.exports.fetchSong = async function (id, action, referer, timeout) {
    let song = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_song?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return song
    }

    let songResult = response.result
    for (let i in songResult.comment) {
        let comment = songResult.comment[i]
        let pubs = []
        if (comment.item.alias) {
            pubs.push(comment.item.alias)
        }
        if (comment.item.musician) {
            pubs.push(comment.item.musician)
        }
        if (comment.item.album_type) {
            pubs.push(comment.item.album_type)
        }
        if (comment.item.genre) {
            pubs.push(comment.item.genre)
        }
        if (comment.item.media) {
            pubs.push(comment.item.media)
        }
        if (comment.item.publisher) {
            pubs.push(comment.item.publisher)
        }
        if (comment.item.publish_date) {
            pubs.push(comment.item.publish_date)
        }
        let meta = []
        if (comment.mark_date) {
            meta.push(comment.mark_date)
        }
        if (comment.label) {
            meta.push(comment.label)
        }
        if (comment.rate) {
            meta.push(renderStar(comment.rate + ''))
        }
        song.push({
            title: comment.item.title,
            alt: "https://music.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return song
}


module.exports.fetchMovie = async function (id, action, referer, timeout) {
    let movie = []
    let response = await syncFetch("https://mouban.mythsman.com/guest/user_movie?action=" + action + "&id=" + id, referer, timeout)
    if (response === "OFFLINE") {
        log.warn("Cannot connect to server")
        return movie
    }

    let movieResult = response.result
    for (let i in movieResult.comment) {
        let comment = movieResult.comment[i]
        let pubs = []
        if (comment.item.style) {
            pubs.push(comment.item.style)
        }
        if (comment.item.director) {
            pubs.push(comment.item.director)
        }
        if (comment.item.writer) {
            pubs.push(comment.item.writer)
        }
        if (comment.item.actor) {
            pubs.push(comment.item.actor)
        }
        if (comment.item.publish_date) {
            pubs.push(comment.item.publish_date)
        }
        let meta = []
        if (comment.mark_date) {
            meta.push(comment.mark_date)
        }
        if (comment.label) {
            meta.push(comment.label)
        }
        if (comment.rate) {
            meta.push(renderStar(comment.rate + ''))
        }
        movie.push({
            title: comment.item.title,
            alt: "https://movie.douban.com/subject/" + comment.item.douban_id + "/",
            image: comment.item.thumbnail,
            pub: pubs.join(" / "),
            meta: meta.join(" / "),
            comment: comment.comment
        })
    }
    return movie
}

module.exports.fetchData = async function (id, referer, type, timeout) {
    let userResult = await syncFetch("https://mouban.mythsman.com/guest/check_user?id=" + id, referer, timeout)
    if (userResult === "OFFLINE") {
        log.warn("Cannot connect to server")
        return {
            wish: [],
            do: [],
            collect: []
        }
    }
    if (!userResult.success) {
        log.warn(userResult.msg)
        return {
            wish: [],
            do: [],
            collect: []
        }
    }

    let wish = await this.fetchAction(id, 'wish', referer, type, timeout)
    let dO = await this.fetchAction(id, 'do', referer, type, timeout)
    let collect = await this.fetchAction(id, 'collect', referer, type, timeout)

    return {
        wish: wish,
        do: dO,
        collect: collect
    }
}
