import { point } from "./../model/shape";
import { QPaintView } from "../painter/view";
class QShapeSelector {
  started: Boolean;
  pt: point;
  ptMove: point;
  qview: QPaintView;
  constructor(qview: QPaintView) {
    this.started = false;
    this.pt = { x: 0, y: 0 };
    this.ptMove = { x: 0, y: 0 };
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
    this.qview.drawing.style.cursor = "auto";
  }

  reset() {
    this.started = false;
    this.qview.invalidateRect();
  }

  onmousedown(event: MouseEvent) {
    this.pt = this.ptMove = this.qview.getMousePos(event);
    this.started = true;
    let ht = this.qview.doc.hitTest(this.pt);
    if (this.qview.selection != ht.hitShape) {
      this.qview.selection = ht.hitShape;
      this.qview.invalidateRect();
    }
  }
  onmousemove(event: MouseEvent) {
    let pt = this.qview.getMousePos(event);
    if (this.started) {
      this.ptMove = pt;
      this.qview.invalidateRect();
    } else {
      let ht = this.qview.doc.hitTest(pt);
      if (ht.hitCode > 0) {
        this.qview.drawing.style.cursor = "move";
      } else {
        this.qview.drawing.style.cursor = "auto";
      }
    }
  }
  onmouseup(event: MouseEvent) {
    if (this.started) {
      let selection = this.qview.selection;
      if (selection != null) {
        let pt = this.qview.getMousePos(event);
        selection.move(pt.x - this.pt.x, pt.y - this.pt.y);
      }
      this.reset();
    }
  }
  onkeydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 8: // keyBackSpace
      case 46: // keyDelete
        this.qview.doc.deleteShape(this.qview.selection);
        this.qview.selection = null;
      case 27: // keyEsc
        this.reset();
        break;
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let selection = this.qview.selection;
    if (selection != null) {
      let bound = selection.bound();
      if (this.started) {
        bound.x += this.ptMove.x - this.pt.x;
        bound.y += this.ptMove.y - this.pt.y;
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "gray";
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.rect(bound.x, bound.y, bound.width, bound.height);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}

export { QShapeSelector };
