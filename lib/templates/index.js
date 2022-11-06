/**
 * Created by myths on 18-2-8.
 */

Element.prototype.siblings = function () {
    let siblingElement = [];
    let sibs = this.parentNode.children;
    for (let i = 0; i < sibs.length; i++) {
        if (sibs[i] !== this) {
            siblingElement.push(sibs[i]);
        }
    }
    return siblingElement;
};

function tabClick() {
    //修改标签样式
    this.classList.add('hexo-douban-active');
    let sibs = this.siblings();
    for (let j = 0; j < sibs.length; j++) {
        sibs[j].classList.remove('hexo-douban-active');
    }
    //显示对应板块
    let itemId = this.id.replace('tab', 'item');
    let target = document.getElementById(itemId);
    target.classList.remove('hexo-douban-hide');
    target.classList.add('hexo-douban-show');
    sibs = document.getElementById(itemId).siblings();
    for (let k = 0; k < sibs.length; k++) {
        sibs[k].classList.remove('hexo-douban-show');
        sibs[k].classList.add('hexo-douban-hide');
    }
}

let tabs = document.getElementsByClassName("hexo-douban-tab");
for (let i = 0; i < tabs.length; i++) {
    tabs[i].onclick = tabClick;
    tabs[i].onclick.apply(tabs[i]);
}
tabs[2].click();
