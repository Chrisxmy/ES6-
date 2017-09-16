const Exposure = (function(){


class _Exporsure {
  constructor(img,load,imgArry) {
    this.img = img;
    this.load = load,
    this.status = true
    this.imgArray = imgArry
    this.check().bindEvents();
  }

  bindEvents() { 
    window.addEventListener("scroll", () => {
      if(!this.status)  return 
         setTimeout(() => {
             this.check()
         },500)
         this.checkAttr()
    });
  }
  checkAttr() {
    if(!this.imgArray[this.imgArray.length - 1 ].getAttribute('date-src')){
      this.load.style.display = 'block'
      this.status = false
    }
     
  }

  check() {
      console.log(1)
    if (this.ishow(this.img)) {
      let imgUrl = this.img.getAttribute("date-src");
      if(imgUrl) {
         this.img.removeAttribute("date-src")
         this.img.setAttribute("src", imgUrl);
      } 
    }
    return this
  }


  ishow(node) {
    var windowHeight = window.innerHeight,
      scrollTop = window.scrollY,
      nodeHeight = node.height,
      offsetTop =  node.offsetTop;
    if (
      scrollTop + windowHeight > offsetTop &&
      scrollTop < offsetTop + nodeHeight
    ) {
      return true;
    } else {
      return false;
    }
  }
}

return {
  init(imgArry,load){
    imgArry = Array.from(imgArry)
    if (utils.checkType(imgArry) !== 'array') throw new Error('options must be array')
    imgArry.forEach((img, index) => {
        if(img.getAttribute('date-src')) new _Exporsure(img,load,imgArry)      
    })
    }       
}

})()


