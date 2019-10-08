import { Shape, Rect, point, QShapeStyle } from "./shape";
class Text implements Shape {
  text: string;
  pt: point;
  style: QShapeStyle;

  constructor(text: string, pt: point, style: QShapeStyle) {
    this.text = text;
    this.pt = pt;
    this.style = style;
  }

  bound(): Rect {
    throw new Error("Method not implemented.");
  }
  hitTest(pt: point) {
    throw new Error("Method not implemented.");
  }
  setProp(key: string, val: any): void {
    this.style.setProp(key, val);
  }
  move(dx: number, dy: number): void {
    this.pt.x += dx;
    this.pt.y += dy;
  }

  onpaint(ctx: CanvasRenderingContext2D): void {
    ctx.fillText(this.text, this.pt.x, this.pt.y);
  }
}
