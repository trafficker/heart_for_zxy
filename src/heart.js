const width = 600;
const height = 600;
const centerX = width / 2;
const centerY = height / 2;

const canvas = document.querySelector("#heart");
const context = canvas.getContext("2d");
context.moveTo(0, 0);
context.fillStyle = "RGBA(252, 107, 113, 1.00)";

class Heart {

  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomF(max) {
    return Math.floor(Math.random() * (max + 1)) * (!!Math.floor(Math.random() * 2) ? 1 : -1);
  }

  static generator(t, ratio = 11) {
    let x = 17 * Math.sin(t) ** 3;
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 3 * Math.cos(3 * t) - Math.cos(4 * t));

    x *= ratio;
    y *= ratio;

    x += centerX;
    y += centerY;

    return {
      x: parseInt(x),
      y: parseInt(y)
    };
  }

  static expand(x, y, beta = 0.05) {
    const _x = -beta * Math.log(Heart.random(0, 1.1));
    const _y = -beta * Math.log(Heart.random(0, 1.1));

    const dx = _x * (x - centerX);
    const dy = _y * (y - centerX);

    return {
      x: parseInt(x - dx),
      y: parseInt(y - dy)
    };
  }

  static shrink(x, y, ratio) {
    const k = -1 / ((x - centerX) ** 2 + (y - centerY) ** 2) ** 0.5;

    const dx = ratio * k * (x - centerX);
    const dy = ratio * k * (y - centerY);

    return {
      x: parseInt(x - dx),
      y: parseInt(y - dy)
    };
  }

  static sport(k) {
    return 2 * (2 * Math.sin(4 * k)) / 2 * Math.PI;
  }

  static getPosition(x, y, ratio) {
    const k = 1 / (((x - centerX) ** 2 + (y - centerY) ** 2) ** 0.520);

    const dx = ratio * k * (x - centerX) + Heart.randomF(1);
    const dy = ratio * k * (y - centerY) + Heart.randomF(1);;

    console.log(parseInt(x - dx), parseInt(y - dy));
    return {
      x: parseInt(x - dx),
      y: parseInt(y - dy)
    };
  }

  constructor() {
    this.init();
  }

  init() {
    this.fps = 30;
    this.timer = null;
    this.points = [];
    this.edgePoints = [];
    this.centerPoints = [];
    this.fpsPoints = {};
    this.initPoints(3000);
    this.initEdgePoints();
    this.initCenterPoints(6000);

    let f = 0;
    while (f < this.fps) {
      this.initFpsPoints(f)
      f++;
    };
  }

  initPoints(n) {
    let i = 0;
    while (i < n) {
      const t = Heart.random(0, 2 * Math.PI);
      const res = Heart.generator(t);
      this.points.push({
        x: res.x,
        y: res.y,
      });
      i++;
    };
  }

  initEdgePoints() {
    this.points.forEach(point => {
      let i = 0;
      while (i < 3) {
        const res = Heart.expand(point.x, point.y);
        this.edgePoints.push({
          x: res.x,
          y: res.y,
        });
        i++;
      }
    });
  }

  initCenterPoints(n) {
    let i = 0;
    while (i < n) {
      const point = this.points[Math.floor(Math.random() * this.points.length)];
      const res = Heart.expand(point.x, point.y, 0.17);
      this.centerPoints.push({
        x: res.x,
        y: res.y,
      });
      i++;
    }
  }

  initFpsPoints(f) {
    const ratio = 10 * Heart.sport(f / 10 * Math.PI) / 1;
    const radius = parseInt(4 + 6 * (1 + Heart.sport(f / 10 * Math.PI)));
    const number = parseInt(3000 + 5000 * Math.abs(Heart.sport(f / 10 * Math.PI) ** 2));

    const allPoints = [];
    const haloPoints = [];

    let i = 0;
    while (i < number) {
      const t = Heart.random(0, 4 * Math.PI);
      const point = Heart.generator(t, 11.5);
      const res = Heart.shrink(point.x, point.y, radius);

      if (haloPoints.every(point => point.x !== res.x && point.y !== res.y)) {
        haloPoints.push({
          x: res.x,
          y: res.y,
        });
        const x = res.x + Heart.randomF(14);
        const y = res.y + Heart.randomF(14);
        const size = [1, 2, 3][Math.floor(Math.random() * 3)];
        allPoints.push({
          x,
          y,
          size,
        });
      }
      i++;
    }

    this.points.forEach(point => {
      const res = Heart.getPosition(point.x, point.y, ratio)
      const size = [1, 2, 3][Math.floor(Math.random() * 3)];
      allPoints.push({
        x: res.x,
        y: res.y,
        size,
      })
    });

    this.edgePoints.forEach(point => {
      const res = Heart.getPosition(point.x, point.y, ratio)
      const size = [1, 2][Math.floor(Math.random() * 2)];
      allPoints.push({
        x: res.x,
        y: res.y,
        size,
      })
    });

    this.centerPoints.forEach(point => {
      const res = Heart.getPosition(point.x, point.y, ratio)
      const size = [1, 2][Math.floor(Math.random() * 2)];
      allPoints.push({
        x: res.x,
        y: res.y,
        size,
      })
    });

    this.fpsPoints[f] = allPoints;
  }

  render(f) {
    this.fpsPoints[f % this.fps].forEach(point => {
      context.fillRect(point.x, point.y, point.size, point.size);
    });
  }

  draw() {
    let f = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      context.clearRect(0, 0, width, height);
      this.render(f++);
    }, 500);
  }
}

const heart = new Heart();
heart.draw();
