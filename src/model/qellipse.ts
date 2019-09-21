import { Shape, point, QShapeStyle, Rect, fill } from "./shape";
class QEllipse implements Shape {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  style: QShapeStyle;
  constructor(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    lineStyle: QShapeStyle
  ) {
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.style = lineStyle;
  }
  bound(): Rect {
    return {
      x: this.x - this.radiusX,
      y: this.y - this.radiusY,
      width: this.radiusX * 2,
      height: this.radiusY * 2
    };
  }
  hitTest(pt: point) {
    let dx = pt.x - this.x;
    let dy = pt.y - this.y;
    let a = this.radiusX;
    let b = this.radiusY;
    if ((dx * dx) / a / a + (dy * dy) / b / b <= 1) {
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
    let lineStyle = this.style;
    ctx.lineWidth = lineStyle.lineWidth;
    ctx.strokeStyle = lineStyle.lineColor;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    fill(ctx, this.style.fillColor);
    ctx.stroke();
  }
}
export { QEllipse };
