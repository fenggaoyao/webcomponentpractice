import { Shape, point } from "./shape";
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
  deleteShape(shape: Shape) {
    deleteItem(this.shapes, shape);
  }

  hitTest(pt: point) {
    let shapes = this.shapes;
    let n = shapes.length;
    for (let i = n - 1; i >= 0; i--) {
      let ret = shapes[i].hitTest(pt);
      if (ret.hitCode > 0) {
        return ret;
      }
    }
    return { hitCode: 0, hitShape: null };
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    this.shapes.forEach(item => item.onpaint(ctx));
  }
}

function deleteItem(array: Shape[], item: Shape) {
  let index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export { QPaintDoc };
