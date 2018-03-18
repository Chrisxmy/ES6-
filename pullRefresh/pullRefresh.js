(function() {
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};

    let pullStartY = null;
    let pullMoveY = null;
    let dis = 0;
    var distResisted = 0;
    let status = 'pending';
    let supportsPassive = false

  class pullRefresh {
    constructor(options) {
      let defaultOptions = {
            // 下拉时的文字
        pullText: "下拉以刷新页面",
        // 下拉时的图标
        pullIcon: "&#8675;",
        // 释放前的文字
        relaseText: "释放以刷新页面",
        // 释放后的文字
        refreshText: "刷新",
        // 释放后的图标
        refreshIcon: "&hellip;",
        // 当大于 60px 的时候才会触发 relase 事件
        threshold: 60,
        // 最大可以拉到 80px 的高度
        max: 80,
        // 释放后，高度回到 50px
        reloadHeight: 50
      };
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

    supportsPassive() {
        try {
            var opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });
            window.addEventListener("test", null, opts);
        } catch (e) {}
    };
    bindEvents() {
        window.addEventListener('touchstart',this)
        window.addEventListener('touchmove',this, supportsPassive ? { passive: false } :
            false)
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

    resistanceFunction(t) {
        return Math.min(1, t / 2.5);
    };

    ontouchstart(e) {
        if(this.shouldPull()) {
           pullStartY = e.touches[0].screenY
        }
        if (status !== 'pending') {
            return;
        }
      status = 'pending'
      this.changeText()
         
    }
    ontouchmove(e) {
         pullMoveY = e.touches[0].screenY;

        if (status === 'pending') {
            this.options.refreshStart()
            this.element.classList.add(("pull"));
            status = 'pulling';
            this.changeText();
        }

         if(pullStartY) {
             dis = pullMoveY - pullStartY;
         }

         if(dis > 0 ) {
             this.element.style.height = distResisted + 'px'
             distResisted = this.resistanceFunction(dis / this.options.threshold) *
                 Math.min(this.options.max, dis);

          if( distResisted > this.options.threshold && status === 'pulling') {
               this.element.classList.add('release')
               status = 'releasing'
               this.changeText()
          }

          if(distResisted < this.options.threshold && status === 'releasing') {
               this.element.classList.remove('release')
               status = 'pulling'
               this.changeText()
          }
         }
    }
      ontouchend(e) {
          if(status === 'releasing' && dis > this.options.threshold) {
              status = 'refreshing'
              this.element.style.height = this.options.reloadHeight
              this.options.refreshed(this.reset.bind(this))
          } else {
              if(status === 'refreshing') return 
              this.element.style.height = 0
              status = 'pending'
          }
          this.changeText()
          this.element.classList.remove("release");
          this.element.classList.remove("pull");

           pullStartY = pullMoveY = null;
           dis = distResisted = 0;
         
    }
    reset() {
          this.element.style.height = '0px'
          status = 'pending'
    }
    changeText(){
        const textEl = this.element.querySelector('.refresh-text')
        const iconEl = this.element.querySelector('.refresh-icon')

        if(status === 'pending' || status === 'pulling') {
             iconEl.innerHTML =  this.options.pullIcon;
             textEl.innerHTML = this.options.pullText
        }

        if(status === 'releasing') {
            textEl.innerHTML = this.options.relaseText
        }

        if(status === 'refreshing') {
            textEl.innerHTML = this.options.refreshText
            iconEl.innerHTML =  this.options.refreshIcon;
        }
        
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
