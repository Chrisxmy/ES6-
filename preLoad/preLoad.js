class PreLoad {
  constructor(options) {
    let defaultOptions = {};
    this.options = Object.assign({}, defaultOptions, options);
    this.pics = this.options.pics;
    this.init();
    this.failNum = 0
    this.index = 0;
  }
  init() {
    for (let i = 0; i < this.pics.length; i++) {
      this.loadImg(this.pics[i]);
    }
  }
  loadImg(src) {
    var img = new Image();

    img.onload = () => {
      img.onload = null;
      this.progress(src);
    };

    img.onerror = () => {
       this.progress(src,'fail');
       
    }

    img.src = src;
  }
  progress(src, type) {
    if(type === 'fail') this.failNum++
    this.index++;
    this.options.progress(this.index, this.pics.length);

    if (this.index === this.pics.length) {
      this.options.complete(this.pics.length - this.failNum, this.failNum);
    }
  }
}
