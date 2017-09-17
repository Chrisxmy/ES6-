class Drag {
  constructor(target) {
    this.target = target;
    this.bindEvents();
  }
  bindEvents() {
    this.target.addEventListener(
      "mousedown",
      e => {
        this.mousedownHandler(e);
      },
      false
    );
    document.addEventListener(
      "mousemove",
      e => {
        this.mousemoveHandler(e);
      },
      false
    );
    document.addEventListener(
      "mouseup",
      e => {
        this.mouseupHandler(e);
      },
      false
    );
  }

  mousedownHandler(e) {
    e = e || event;
    this.isMoving = true;
    //获取元素距离定位父级的x轴及y轴距离
    this.x0 = this.target.offsetLeft;
    this.y0 = this.target.offsetTop;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    this.x1 = e.clientX;
    this.y1 = e.clientY;
    //按下鼠标时，表示正在运动
    this.isMoving = true;
    //鼠标按下时，获得此时的页面区域
    this.L0 = 0;
    this.R0 = document.documentElement.clientWidth;
    this.T0 = 0;
    this.B0 = document.documentElement.clientHeight;
    //鼠标按下时，获得此时的元素宽高
    this.EH = this.target.offsetHeight;
    this.EW = this.target.offsetWidth;
  }
  mousemoveHandler(e) {
    //如果没有触发down事件，而直接触发move事件，则函数直接返回
    if (!this.isMoving) {
      return;
    }
    e = e || event;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    var x2 = e.clientX;
    var y2 = e.clientY;

    //计算此时元素应该距离视口左上角的x轴及y轴距离
    var X = this.x0 + (x2 - this.x1);
    var Y = this.y0 + (y2 - this.y1);
    /******磁性吸附*******/
    //获取鼠标移动时元素四边的瞬时值
    var L = X;
    var R = X + this.EW;
    var T = Y;
    var B = Y + this.EH;
    //在将X和Y赋值给left和top之前，进行范围限定。只有在范围内时，才进行相应的移动
    //如果到达左侧的吸附范围，则left置L0
    if (L - this.L0 < 10) {
      X = this.L0;
    }
    //如果到达右侧的吸附范围，则left置为R0
    if (this.R0 - R < 10) {
      X = this.R0 - this.EW;
    }
    //如果到达上侧的吸附范围，则top置T0
    if (T - this.T0 < 10) {
      Y = this.T0;
    }
    //如果到达下侧的吸附范围，则top置为B0
    if (this.B0 - B < 10) {
      Y = this.B0 - this.EH;
    }

    //将X和Y的值赋给left和top，使元素移动到相应位置
    this.target.style.left = X + "px";
    this.target.style.top = Y + "px";
  }

  mouseupHandler(e) {
    this.isMoving = false;
  }
}

