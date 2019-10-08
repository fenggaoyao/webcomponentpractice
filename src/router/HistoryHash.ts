export class HistoryHash {
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
    let current = location.pathname;
    window.addEventListener("popstate", () => {
      if (current != location.pathname) {
        current = location.pathname;
        for (let i = 0; i < this.routers.length; i++) {
          const match = current.match(this.routers[i].re);
          console.log(match);
          if (match) {
            match.shift();
            this.routers[i].handler.apply({}, match);
            return;
          }
        }
      }
    });
    return this;
  }

  push(path = "") {
    window.history.pushState({}, "", path);
  }

  replace(path = "") {
    window.history.replaceState({}, "", path);
  }

  black() {}
}
