import { QPaintView } from "./../view";
import { QRect, QLine, QEllipse, Shape } from "./../dom";
class QRectCreator {
  shapetype: string;
  rect: any;
  started: Boolean;
  qview: QPaintView;
  constructor(shapetype: string, qview: QPaintView) {
    this.shapetype = shapetype;
    this.rect = {
      p1: {
        x: 0,
        y: 0
      },
      p2: {
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

    this.qview = qview;
  }

  buildShape(): Shape {
    let rect = this.rect;
    let r = this.normalizeRect(rect);
    switch (this.shapetype) {
      case "rect":
        return new QRect(r, this.qview.lineStyle);
      case "line":
        return new QLine(this.rect.p1, this.rect.p2, this.qview.lineStyle);
      case "ellipse":
        let rx = r.width / 2;
        let ry = r.height / 2;
        return new QEllipse(r.x + rx, r.y + ry, rx, ry, this.qview.lineStyle);
      case "circle":
        let rc = Math.sqrt(r.width * r.width + r.height * r.height);
        return new QEllipse(rect.p1.x, rect.p1.y, rc, rc, this.qview.lineStyle);
      default:
        throw "";       
    }
  }
  reset() {
    this.started = false;
    this.qview.invalidateRect();
  }

  stop() {
    this.qview.onmousedown = null;
    this.qview.onmousemove = null;
    this.qview.onmouseup = null;
  }

  onmousedown(event: MouseEvent) {
    this.rect.p1 = this.qview.getMousePos(event);
    this.started = true;
  }
  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.rect.p2 = this.qview.getMousePos(event);
      this.qview.invalidateRect();
    }
  }
  onmouseup(event: MouseEvent) {
    if (this.started) {
      this.rect.p2 = this.qview.getMousePos(event);
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

  normalizeRect(rect: any) {
    let x = rect.p1.x;
    let y = rect.p1.y;
    let width = rect.p2.x - x;
    let height = rect.p2.y - y;
    if (width < 0) {
      x = rect.p2.x;
      width = -width;
    }
    if (height < 0) {
      y = rect.p2.y;
      height = -height;
    }
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  }
}

export { QRectCreator };
