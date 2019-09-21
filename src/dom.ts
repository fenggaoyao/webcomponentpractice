class QPaintDoc {
  shapes: Shape[];
  constructor() {
    this.shapes = [];
  }
  addShape(shape: Shape) {
    if (shape !== null) {
      this.shapes.push(shape);
    }
  }
  onpaint(ctx: CanvasRenderingContext2D) {
    this.shapes.forEach(item => item.onpaint(ctx));
  }
}

interface QLineStyle {
  width: number;
  color: string;
}

interface Shape {
  onpaint(ctx: CanvasRenderingContext2D): void;
}

interface point {
  x: number;
  y: number;
}

class QLine implements Shape {
  p1: point;
  p2: point;
  lineStyle: QLineStyle;

  constructor(p1: point, p2: point, lineStyle: QLineStyle) {
    this.p1 = p1;
    this.p2 = p2;
    this.lineStyle = lineStyle;
  }
  onpaint(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.lineStyle.color;
    ctx.lineWidth = this.lineStyle.width;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }
}

class QRect implements Shape {
  x: number;
  y: number;
  width: number;
  height: number;
  lineStyle: QLineStyle;

  constructor(r: any, lineStyle: QLineStyle) {
    this.x = r.x;
    this.y = r.y;
    this.width = r.width;
    this.height = r.height;
    this.lineStyle = lineStyle;
  }
  onpaint(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.lineStyle.color;
    ctx.lineWidth = this.lineStyle.width;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }
}

class QEllipse implements Shape {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  lineStyle: QLineStyle;
  constructor(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    lineStyle: QLineStyle
  ) {
    this.x = x;
    this.y = y;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.lineStyle = lineStyle;
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

class QPath implements Shape {
  points: any;
  close: any;
  lineStyle: QLineStyle;
  constructor(points: any, close: any, lineStyle: QLineStyle) {
    this.points = points;
    this.close = close;
    this.lineStyle = lineStyle;
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let n = this.points.length;
    if (n < 1) {
      return;
    }
    let points = this.points;
    let lineStyle = this.lineStyle;
    ctx.lineWidth = lineStyle.width;
    ctx.strokeStyle = lineStyle.color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < n; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    if (this.close) {
      ctx.closePath();
    }
    ctx.stroke();
  }
}

export { QPaintDoc, QLine, QRect, QLineStyle, QEllipse, QPath, point, Shape };
