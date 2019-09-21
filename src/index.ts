import { QPaintView } from "./view";
import { QPaintDoc } from "./dom";
import { QRectCreator } from "./controller/rect";
import { QPathCreator } from "./controller/path";

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
let menu = document.getElementById("menu") as HTMLElement;
menu.innerHTML = `
    <input type="button" id="PathCreator" value="Create Path" style="visibility:hidden">   
    <input type="button" id="LineCreator" value="Create Line" style="visibility:hidden">
    <input type="button" id="RectCreator" value="Create Rect" style="visibility:hidden">
    <input type="button" id="EllipseCreator" value="Create Ellipse" style="visibility:hidden">
    <input type="button" id="CircleCreator" value="Create Circle" style="visibility:hidden">`;

for (let gkey in view.controllers) {
  let key = gkey;
  let elem = document.getElementById(key) as HTMLElement;
  elem.style.visibility = "visible";
  elem.onclick = function() {
    if (view.currentKey != "") {
      (document.getElementById(view.currentKey) as HTMLElement).removeAttribute(
        "style"
      );
    }
    elem.style.borderColor = "blue";
    elem.blur();
    view.invokeController(key);
  };
}

menu.insertAdjacentHTML(
  "afterend",
  `<br><div id="properties">
    <label for="LineWidth">LineWidth: </label>
    <select id="LineWidth" ">
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="9">9</option>
        <option value="11">11</option>
    </select>&nbsp;

    <label for="LineColor">LineColor: </label>
    <select id="LineColor" ">
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
  view.properties.lineColor = lineColor.value;
};

let lineWidth = document.getElementById("LineWidth") as HTMLSelectElement;
lineWidth.onchange = event => {
  lineWidth.blur();
  let val = parseInt(lineWidth.value);
  if (val > 0) {
    view.properties.lineWidth = val;
  }
};

let props = document.getElementById("properties") as HTMLElement;
props.insertAdjacentHTML("beforeend", `&nbsp;<span id="mousepos"></span>`);
let old = view.drawing.onmousemove;
let mousepos = document.getElementById("mousepos") as HTMLElement;
view.drawing.onmousemove = (event: MouseEvent) => {
  let pos = view.getMousePos(event);
  mousepos.innerText = "MousePos: " + pos.x + ", " + pos.y;
  old(event);
};
