import {
  Shape,
  point,
  QShapeStyle,
  Rect,
  normalizeRect,
  hitLine
} from "./shape";
class QLine implements Shape {
  pt1: point;
  pt2: point;
  style: QShapeStyle;

  constructor(p1: point, p2: point, lineStyle: QShapeStyle) {
    this.pt1 = p1;
    this.pt2 = p2;
    this.style = lineStyle;
  }
  bound(): Rect {
    return normalizeRect(this);
  }
  hitTest(pt: point): any {
    if (hitLine(pt, this.pt1, this.pt2, this.style.lineWidth)) {
      return { hitCode: 1, hitShape: this };
    }
    return { hitCode: 0, hitShape: null };
  }
  setProp(key: string, val: any): void {
    this.style.setProp(key, val);
  }
  move(dx: number, dy: number): void {
    this.pt1.x += dx;
    this.pt1.y += dy;
    this.pt2.x += dx;
    this.pt2.y += dy;
  }
  onpaint(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.style.lineColor;
    ctx.lineWidth = this.style.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.pt1.x, this.pt1.y);
    ctx.lineTo(this.pt2.x, this.pt2.y);
    ctx.stroke();
  }
}

export { QLine };
