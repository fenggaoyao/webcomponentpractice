export class HashRouter {
  routers: any;
  constructor() {
    this.routers = [];
  }
  add(re: any, handler: any) {
    this.routers.push({
      re,
      handler
    });
  }
  listen() {
    let current = location.hash as any;
    window.addEventListener("hashchange", () => {
      if (current != current.hash) {
        current = location.hash;
        for (let i = 0; i < this.routers.length; i++) {
          const match = current.match(this.routers[i].re);
          if (match) {
            // match.shift();
            console.log(match);
            this.routers[i].handler.call({}, match);
            return;
          }
        }
      }
    });
    return this;
  }

  push(path = "") {
    window.location.hash = path;
  }
  replace(path = "") {
    const i = window.location.href.indexOf("#");
    window.location.replace(
      window.location.href.slice(0, i >= 0 ? i : 0) + "#" + path
    );
  }
  black() {}
}
