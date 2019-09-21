interface Shape {
  onpaint(ctx: CanvasRenderingContext2D): void;
  //求图形的外接矩形
  bound(): Rect;
  //用于选择图形
  hitTest(pt: point): any;
  //修改样式
  setProp(key: string, val: any): void;
  //移动
  move(dx: number, dy: number): void;
}
interface point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface QShapeStyle {
  [key: string]: any;
  setProp(key: string, val: any): void;
  clone(): void;
}
class QShapeStyle {
  lineWidth: number;
  lineColor: string;
  fillColor: string;

  constructor(lineWidth: number, lineColor: string, fillColor: string) {
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
  }
  setProp(key: string, val: any) {
    this[key] = val;
  }
  clone() {
    return new QShapeStyle(this.lineWidth, this.lineColor, this.fillColor);
  }
}
function normalizeRect(rect: any) {
  let x = rect.pt1.x;
  let y = rect.pt1.y;
  let width = rect.pt2.x - x;
  let height = rect.pt2.y - y;
  if (width < 0) {
    x = rect.pt2.x;
    width = -width;
  }
  if (height < 0) {
    y = rect.pt2.y;
    height = -height;
  }
  return { x: x, y: y, width: width, height: height };
}

function hitLine(pt: point, pt1: point, pt2: point, width: number) {
  if ((pt1.x - pt.x) * (pt.x - pt2.x) < 0) {
    return false;
  }
  if ((pt1.y - pt.y) * (pt.y - pt2.y) < 0) {
    return false;
  }
  let dy = pt2.y - pt1.y;
  let dx = pt2.x - pt1.x;
  let d12 = Math.sqrt(dx * dx + dy * dy);
  if (d12 < 0.1) {
    return false;
  }
  let d =
    Math.abs(dy * pt.x - dx * pt.y + pt2.x * pt1.y - pt1.x * pt2.y) / d12 - 2;
  return width >= d * 2;
}

function hitRect(pt: point, r: any) {
  if ((r.x + r.width - pt.x) * (pt.x - r.x) < 0) {
    return false;
  }
  if ((r.y + r.height - pt.y) * (pt.y - r.y) < 0) {
    return false;
  }
  return true;
}

function fill(ctx: CanvasRenderingContext2D, fillColor: string) {
  if (fillColor != "null") {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
}

export {
  Shape,
  QShapeStyle,
  point,
  Rect,
  normalizeRect,
  hitLine,
  hitRect,
  fill
};
