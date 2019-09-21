import { QPaintView } from "./../view";
import { normalizeRect, Shape } from "./../model/shape";
import { QRect } from "./../model/Rect";
import { QLine } from "./../model/line";
import { QEllipse } from "./../model/QEllipse";
class QRectCreator {
  shapetype: string;
  rect: any;
  started: Boolean;
  qview: QPaintView;
  constructor(shapetype: string, qview: QPaintView) {
    this.shapetype = shapetype;
    this.rect = {
      pt1: {
        x: 0,
        y: 0
      },
      pt2: {
        x: 0,
        y: 0
      }
    };
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

  buildShape(): Shape {
    let rect = this.rect;
    let r = normalizeRect(rect);
    let style = this.qview.style.clone();
    switch (this.shapetype) {
      case "rect":
        return new QRect(r, style);
      case "line":
        return new QLine(this.rect.pt1, this.rect.pt2, style);
      case "ellipse":
        let rx = r.width / 2;
        let ry = r.height / 2;
        return new QEllipse(r.x + rx, r.y + ry, rx, ry, style);
      case "circle":
        let rc = Math.sqrt(r.width * r.width + r.height * r.height);
        return new QEllipse(rect.pt1.x, rect.pt1.y, rc, rc, style);
      default:
        alert("unknown shapeType: " + this.shapetype);
        throw new Error("");
    }
  }
  reset() {
    this.started = false;
    this.qview.invalidateRect();
    this.qview.fireControllerReset();
  }

  stop() {
    this.qview.onmousedown = null;
    this.qview.onmousemove = null;
    this.qview.onmouseup = null;
    this.qview.onkeydown = null;
  }

  onmousedown(event: MouseEvent) {
    this.rect.pt1 = this.qview.getMousePos(event);
    this.started = true;
  }
  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.rect.pt2 = this.qview.getMousePos(event);
      this.qview.invalidateRect();
    }
  }
  onmouseup(event: MouseEvent) {
    if (this.started) {
      this.rect.pt2 = this.qview.getMousePos(event);
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
      this.buildShape().onpaint(ctx);
    }
  }
}

export { QRectCreator };
