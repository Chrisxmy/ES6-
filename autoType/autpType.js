(function() {
  var root =
    (typeof self == "object" && self.self == self && self) ||
    (typeof global == "object" && global.global == global && global) ||
    this ||
    {};
  class AutoType {
    constructor(options) {
      let defaultOptions = {
        element: null,
        time: 500
      };
      this.options = Object.assign({}, defaultOptions, options);

      this.element = this.options.element;
      this.arr = this.options.arr;
      this.textArr = [];
      this.index = 0;
      this.handle();
    }

    handle() {
      let current = this.arr[this.index];
      if (!current) return;

      switch (current.type) {
        case "text":
          this.handleText(current);
          break;
        case "wait":
          this.handleWait(current);
          break;
        case "delete":
          this.handleDelete(current);
          break;
        case "br":
          this.handleBr(current);
          break;
      }
    }
    handleText(current) {
      let textArr = current.text.split("");
      let time = current.time || this.options.time;
      let index = 0;
      let timeId = setInterval(() => {
        this.textArr.push(textArr[index]);
        this.render();
        index++;
        if (index === textArr.length) {
          clearInterval(timeId);
          this.next();
        }
      }, time);
    }

    handleDelete(current) {
      if (current.num > 0) {
        let timeId = setInterval(() => {
          this.textArr.pop();
          this.render();
          --current.num;
          if (current.num === 0) {
            clearInterval(timeId);
            this.next();
          }
        }, current.time ? current.time : this.options.time);
      }
    }

    handleBr(current) {
      let line = current.line;
      for (let i = 0; i < line; i++) {
        this.textArr.push("<br />");
      }
      this.index++;
      setTimeout(() => {
        this.handle();
      }, current.time ? current.time : this.options.time);
    }

    handleWait(current) {
      this.index++;
      setTimeout(() => {
        this.handle();
      }, current.time ? current.time : this.options.time);
    }

    render() {
      this.element.innerHTML = this.textArr.join("");
    }
    next() {
      this.index++;
      this.handle();
    }
  }

  if (typeof exports != "undefined" && !exports.nodeType) {
    if (typeof module != "undefined" && !module.nodeType && module.exports) {
      exports = module.exports = AutoType;
    }
    exports.AutoType = AutoType;
  } else {
    root.AutoType = AutoType;
  }
})();
