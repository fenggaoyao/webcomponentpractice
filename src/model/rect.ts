import { Shape, point, QShapeStyle, Rect, hitRect, fill } from "./shape";
class QRect implements Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  style: QShapeStyle;
  constructor(r: any, lineStyle: QShapeStyle) {
    this.x = r.x;
    this.y = r.y;
    this.width = r.width;
    this.height = r.height;
    this.style = lineStyle;
  }

  bound(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
  hitTest(pt: point) {
    if (hitRect(pt, this)) {
      return { hitCode: 1, hitShape: this };
    }
    return { hitCode: 0, hitShape: null };
  }
  setProp(key: string, val: any): void {
    this.style.setProp(key, val);
  }
  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }
  onpaint(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.style.lineColor;
    ctx.lineWidth = this.style.lineWidth;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    fill(ctx, this.style.fillColor);
    ctx.stroke();
  }
}

export { QRect };
