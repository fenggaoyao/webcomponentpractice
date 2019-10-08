import { Shape, point } from "./../model/shape";
import { QPaintView } from "../painter/view";
import { QPath } from "./../model/path";
class QFreePathCreator {
  points: point[];
  fromPos: point;
  started: Boolean;

  qview: QPaintView;
  constructor(qview: QPaintView) {
    this.points = [];
    this.fromPos = { x: 0, y: 0 };
    this.started = false;
    let ctrl = this;
    qview.onmousedown = function(event: MouseEvent) {
      ctrl.onmousedown(event);
    };
    qview.onmousemove = function(event: MouseEvent) {
      ctrl.onmousemove(event);
    };
    qview.onmouseup = function(event: MouseEvent) {
      ctrl.onmouseup(event);
    };
    qview.onkeydown = function(event: KeyboardEvent) {
      ctrl.onkeydown(event);
    };
    this.qview = qview;
  }
  stop() {
    this.qview.onmousedown = null;
    this.qview.onmousemove = null;
    this.qview.onmouseup = null;
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
    return new QPath(points, false, this.qview.style.clone());
  }

  onmousedown(event: MouseEvent) {
    this.fromPos = this.qview.getMousePos(event);
    this.started = true;
  }
  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.points.push(this.qview.getMousePos(event));
      this.qview.invalidateRect();
    }
  }
  onmouseup(event: MouseEvent) {
    if (this.started) {
      this.qview.doc.addShape(this.buildShape());
      this.reset();
    }
  }
  onkeydown(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      // keyEsc
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
      ctx.stroke();
    }
  }
}

export { QFreePathCreator };
