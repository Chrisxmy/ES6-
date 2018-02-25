class ProgressIndicator {
    constructor(options) {
        let defalutOptions = {
            color: 'red',
            height:'4px',
            callback: function(){
            }
        }
        this.options = Object.assign({}, defalutOptions, options)
        this.render().init().bindEvents()
    }
    init() {
        var width = this.computeWidth()
        this.setWidth(width)
        return this
    }
    addEvent(element, type, fn) {
            if (document.addEventListener) {
                element.addEventListener(type, fn, false);
                return fn;
            } else if (document.attachEvent) {
                var bound = function() {
                    return fn.apply(element, arguments)
                }
                element.attachEvent('on' + type, bound);
                return bound;
            }
        }

    render() {
        var div = document.createElement('div')
        
        div.id = "progress-indicator";

        div.style.position = "fixed"
        div.style.top = 0;
        div.style.left = 0;
        div.style.width = 0;

        div.style.height = this.options.height;
        div.style.backgroundColor = this.options.color;
        
        this.element = div;
        document.body.appendChild(div);
        return this
    }
    bindEvents() {
       this.addEvent(window, 'scroll', () =>{
           window.requestAnimationFrame(() => {
           var perc = Math.min(this.getScrollOffsetsTop() / this.sHeight, 1)  
           this.setWidth(perc); 
                if (perc && perc == 1) {
                    setTimeout(() => {
                       this.options.callback()
                    },18)
                    
                }   
           })         
       })

    }
    getScrollOffsetsTop() {
            var w = window;
            if (w.pageXOffset != null) return w.pageYOffset;
            var d = w.document;
            // 表明是标准模式
            if (document.compatMode == "CSS1Compat") {
                return d.documentElement.scrollTop;
            }
            // 怪异模式
            return d.body.scrollTop;
        }
    computeWidth() {
        this.docHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)

        this.viewHeight = window.innerHeight

        this.sHeight = this.docHeight - this.viewHeight

        this.scrollTop = this.getScrollOffsetsTop()

        return this.sHeight ? (this.scrollTop /  this.sHeight) : 0
    }

     setWidth(perc) {
        this.element.style.width = perc * 100 + "%";
    }

}