(function() {
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};

    let pullStartY
    let pullMoveY

  class pullRefresh {
    constructor(options) {
      let defaultOptions = {};
      this.options = Object.assign({}, defaultOptions, options);
      this.renderHtml()
      this.setStyle()
      this.bindEvents()
    }
    renderHtml() {
        this.element = document.createElement('div');     
        document.body.insertBefore(this.element, document.body.firstChild);
        this.element.id = 'refresh-element'
        this.element.className = 'refresh-element'

        this.element.innerHTML = `<div class="refresh-box">
        <div class="refresh-icon"></div><div class="refresh-text"></div></div>`
    }
    setStyle() {
       var styleElem = document.createElement('style');
        styleElem.setAttribute('id', 'refresh-element-style');
        document.head.appendChild(styleElem);
        styleElem.textContent = `.refresh-element { background-color: #1abc9c;pointer-events: none; font-size: 0.85em; top: 0; height: 0; transition: height 0.3s, min-height 0.3s; text-align: center; width: 100%; overflow: hidden; color: #fff; } 
        .refresh-box {padding: 10px; } 
        .pull {transition: none; } 
        .refresh-text {margin-top: .33em; } 
        .refresh-icon {transition: transform .3s; } 
        .release .refresh-icon {transform: rotate(180deg); }`;
    }
    bindEvents() {
        window.addEventListener('touchstart',this)
        window.addEventListener('touchmove',this)
        window.addEventListener('touchend',this)
    }

    handleEvent(event){
        let method = 'on' + event.type;
        if (this[method]) {
            this[method](event);
        }
    }
    shouldPull(){
        return !window.scrollY
    }
    ontouchstart(e) {
        if(this.shouldPull()) {
           pullStartY = e.touches[0].screenY
        }

      this.changeText()
         
    }
    ontouchmove(e) {
         pullMoveY = e.touches[0].screenY;

         if(pullStartY) {
             var dis= pullMoveY - pullStartY;
         }

         

         if( 80 > dis > 0) {
             this.element.style.height = dis + 'px'
         }
    }
      ontouchend(e) {
         this.element.style.height = '0px'
    }
    changeText(){
        const textEl = this.element.querySelector('.refresh-text')
        const iconEl = this.element.querySelector('.refresh-icon')
        iconEl.innerHTML =  '&#8675';
        textEl.innerHTML = '下拉刷新'
    }
  }

  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = pullRefresh;
    }
    exports.pullRefresh = pullRefresh;
  } else {
    root.pullRefresh = pullRefresh;
  }
})();
