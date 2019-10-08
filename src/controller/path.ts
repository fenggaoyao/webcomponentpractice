import { QPaintView } from "../painter/view";
import { QPath } from "./../model/path";
class QPathCreator {
  points: any;
  close: any;
  fromPos: any;
  toPos: any;
  started: any;
  qview: QPaintView;
  constructor(close: any, qview: QPaintView) {
    this.points = [];
    this.close = close;
    this.fromPos = this.toPos = { x: 0, y: 0 };
    this.started = false;
    let ctrl = this;
    qview.onmousedown = function(event: MouseEvent) {
      ctrl.onmousedown(event);
    };
    qview.onmousemove = function(event: MouseEvent) {
      ctrl.onmousemove(event);
    };
    qview.ondblclick = function(event: MouseEvent) {
      ctrl.ondblclick();
    };
    qview.onkeydown = function(event: KeyboardEvent) {
      ctrl.onkeydown(event);
    };
    this.qview = qview;
  }
  stop() {
    this.qview.onmousedown = null;
    this.qview.onmousemove = null;
    this.qview.ondblclick = null;
    this.qview.onkeydown = null;
  }

  reset() {
    this.points = [];
    this.started = false;
    this.qview.invalidateRect();
    this.qview.fireControllerReset();
  }
  buildShape() {
    let points = [{ x: this.fromPos.x, y: this.fromPos.y }];
    for (let i in this.points) {
      points.push(this.points[i]);
    }
    return new QPath(points, this.close, this.qview.style.clone());
  }

  onmousedown(event: MouseEvent) {
    this.toPos = this.qview.getMousePos(event);
    if (this.started) {
      this.points.push(this.toPos);
    } else {
      this.fromPos = this.toPos;
      this.started = true;
    }
    this.qview.invalidateRect();
  }
  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.toPos = this.qview.getMousePos(event);
      this.qview.invalidateRect();
    }
  }
  ondblclick() {
    if (this.started) {
      this.qview.doc.addShape(this.buildShape());
      this.reset();
    }
  }
  onkeydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 13: // keyEnter
        let n = this.points.length;
        if (n == 0 || this.points[n - 1] !== this.toPos) {
          this.points.push(this.toPos);
        }
        this.ondblclick();
        break;
      case 27: // keyEsc
        this.reset();
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    if (this.started) {
      let props = this.qview.style;
      ctx.lineWidth = props.lineWidth;
      ctx.strokeStyle = props.lineColor;
      ctx.beginPath();
      ctx.moveTo(this.fromPos.x, this.fromPos.y);
      for (let i in this.points) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.lineTo(this.toPos.x, this.toPos.y);
      if (this.close) {
        ctx.closePath();
      }
      ctx.stroke();
    }
  }
}

export { QPathCreator };
