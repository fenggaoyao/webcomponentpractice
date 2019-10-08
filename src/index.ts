import { HistoryHash } from "./router/HistoryHash";
import { HashRouter } from "./router/Router";

import { QPaintView } from "./painter/view";
import { QPaintDoc } from "./model/dom";
import { QRectCreator } from "./controller/rect";
import { QPathCreator } from "./controller/path";
import { QFreePathCreator } from "./controller/freepath";
import { QShapeSelector } from "./controller/select";

let btn = document.getElementById("btn") as HTMLButtonElement;
btn.addEventListener("click", () => {
  let num = Math.random();
  if (num > 0.5) router.push("/painter/index");
  else router.push("/path/c");
});

let menu = document.getElementById("menu") as HTMLElement;
let router = new HashRouter();
router.add(/\/painter\/index/, () => {
  let canvas = document.getElementById("drawing");
  let doc = new QPaintDoc();
  let view = new QPaintView(canvas, doc);
  view.registerController("RectCreator", () => new QRectCreator("rect", view));
  view.registerController("LineCreator", () => new QRectCreator("line", view));
  view.registerController(
    "EllipseCreator",
    () => new QRectCreator("ellipse", view)
  );
  view.registerController(
    "CircleCreator",
    () => new QRectCreator("circle", view)
  );
  view.registerController("PathCreator", () => new QPathCreator(false, view));
  view.registerController("FreePathCreator", function() {
    return new QFreePathCreator(view);
  });
  view.registerController("ShapeSelector", function() {
    return new QShapeSelector(view);
  });

  let menu = document.getElementById("menu") as HTMLElement;
  menu.innerHTML = `
    <input type="button" id="PathCreator" value="Create Path" style="visibility:hidden">
    <input type="button" id="FreePathCreator" value="Create FreePath" style="visibility:hidden">
    <input type="button" id="LineCreator" value="Create Line" style="visibility:hidden">
    <input type="button" id="RectCreator" value="Create Rect" style="visibility:hidden">
    <input type="button" id="EllipseCreator" value="Create Ellipse" style="visibility:hidden">
    <input type="button" id="CircleCreator" value="Create Circle" style="visibility:hidden">
    <input type="button" id="ShapeSelector" value="Select Shape" style="visibility:hidden">`;
  // view.invokeController("ShapeSelector");
  for (let gkey in view.controllers) {
    // if (gkey == "ShapeSelector") {
    //   continue;
    // }
    let key = gkey;
    let elem = document.getElementById(key) as HTMLElement;
    elem.style.visibility = "visible";
    elem.onclick = function() {
      if (view.currentKey != "") {
        (document.getElementById(
          view.currentKey
        ) as HTMLElement).removeAttribute("style");
      }
      elem.style.borderColor = "blue";
      elem.blur();
      view.invokeController(key);
    };
  }

  // view.onControllerReset = function() {
  //   (document.getElementById(view.currentKey) as HTMLElement).removeAttribute(
  //     "style"
  //   );
  //   view.invokeController("ShapeSelector");
  // };

  menu.insertAdjacentHTML(
    "afterend",
    `<br><div id="properties">
    <label for="LineWidth">LineWidth: </label>
    <select id="LineWidth" >
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="9">9</option>
        <option value="11">11</option>
    </select>&nbsp;

    <label for="LineColor">LineColor: </label>
    <select id="LineColor" >
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
    </select>

    <label for="fillColor">FillColor: </label>
    <select id="FillColor" >
        <option value="white">white</option>
        <option value="null">transparent</option>
        <option value="black">black</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="gray">gray</option>
    </select>
    </div>`
  );

  let lineColor = document.getElementById("LineColor") as HTMLSelectElement;
  lineColor.onchange = event => {
    lineColor.blur();
    view.style.lineColor = lineColor.value;
    selection_setProp("lineColor", lineColor.value);
  };

  let fillColor = document.getElementById("FillColor") as HTMLSelectElement;
  fillColor.onchange = event => {
    fillColor.blur();
    view.style.fillColor = fillColor.value;
    selection_setProp("fillColor", fillColor.value);
  };

  let lineWidth = document.getElementById("LineWidth") as HTMLSelectElement;
  lineWidth.onchange = event => {
    lineWidth.blur();
    let val = parseInt(lineWidth.value);
    if (val > 0) {
      view.style.lineWidth = val;
      selection_setProp("lineWidth", val);
    }
  };

  function onSelectionChanged(old: any) {
    let selection = view.selection;
    if (selection != null) {
      let style = selection.style;
      view.style = style.clone();
      (document.getElementById("LineWidth") as HTMLSelectElement).value =
        style.lineWidth;
      (document.getElementById("LineColor") as HTMLSelectElement).value =
        style.lineColor;
      (document.getElementById("FillColor") as HTMLSelectElement).value =
        style.fillColor;
    }
  }

  view.onSelectionChanged = onSelectionChanged;

  function selection_setProp(key: any, val: any) {
    if (view.selection != null) {
      view.selection.setProp(key, val);
      view.invalidateRect();
    }
  }

  let props = document.getElementById("properties") as HTMLElement;
  props.insertAdjacentHTML("beforeend", `&nbsp;<span id="mousepos"></span>`);
  let old = view.drawing.onmousemove;
  let mousepos = document.getElementById("mousepos") as HTMLElement;
  view.drawing.onmousemove = (event: MouseEvent) => {
    let pos = view.getMousePos(event);
    mousepos.innerText = "MousePos: " + pos.x + ", " + pos.y;
    old(event);
  };

  //path a
});
router.add(/\/path\/b/, (match: string) => {
  //path b

  menu.innerText = match;
});
router.add(/\/path\/c/, () => {
  //path c
  menu.innerText = "path c";
});
router.listen();

// router.push("/path/a");
// router.push("/path/b");
