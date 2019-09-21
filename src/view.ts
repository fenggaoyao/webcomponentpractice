import { QPaintDoc } from "./dom";
class QPaintView {
  properties: any;
  controllers: any;
  _currentKey: string;
  _current: any;
  drawing: any;
  doc: QPaintDoc;

  onmousedown: any = null;
  onmousemove: any = null;
  onmouseup: any = null;
  ondblclick: any = null;
  onkeydown: any = null;

  constructor(drawing: any, doc: QPaintDoc) {
    this.properties = {
      lineWidth: 1,
      lineColor: "black"
    };
    this.controllers = {};
    this._currentKey = "";
    this._current = null;

    let view = this;
    drawing.onmousedown = function(event: MouseEvent) {
      event.preventDefault();
      if (view.onmousedown != null) {
        view.onmousedown(event);
      }
    };
    drawing.onmousemove = function(event: MouseEvent) {
      if (view.onmousemove != null) {
        view.onmousemove(event);
      }
    };
    drawing.onmouseup = function(event: MouseEvent) {
      if (view.onmouseup != null) {
        view.onmouseup(event);
      }
    };
    drawing.ondblclick = function(event: MouseEvent) {
      event.preventDefault();
      if (view.ondblclick != null) {
        view.ondblclick(event);
      }
    };
    document.onkeydown = function(event) {
      switch (event.keyCode) {
        case 9:
        case 13:
        case 27:
          event.preventDefault();
      }
      if (view.onkeydown != null) {
        view.onkeydown(event);
      }
    };
    this.drawing = drawing;
    this.doc = doc;
  }

  get currentKey() {
    return this._currentKey;
  }
  get lineStyle() {
    let props = this.properties;
    return { width: props.lineWidth, color: props.lineColor };
  }

  invalidateRect() {
    let ctx = this.drawing.getContext("2d");
    let bound = this.drawing.getBoundingClientRect();
    ctx.clearRect(0, 0, bound.width, bound.height);
    this.onpaint(ctx);
  }

  registerController(name: string, controller: any) {
    if (name in this.controllers) {
      alert("Controller exists: " + name);
    } else {
      this.controllers[name] = controller;
    }
  }

  invokeController(name: string) {
    this.stopController();
    if (name in this.controllers) {
      let controller = this.controllers[name];
      this._setCurrent(name, controller());
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    this.doc.onpaint(ctx);
    if (this._current != null) {
      this._current.onpaint(ctx);
    }
  }

  getMousePos(event: MouseEvent) {
    return {
      x: event.offsetX,
      y: event.offsetY
    };
  }

  stopController() {
    if (this._current != null) {
      this._current.stop();
      this._setCurrent("", null);
    }
  }
  _setCurrent(name: string, ctrl: any) {
    this._currentKey = name;
    this._current = ctrl;
  }
}

export { QPaintView };
