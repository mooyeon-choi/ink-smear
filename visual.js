import { Text } from "./text.js";
import { Particle } from "./particle.js";

export class Visual {
  constructor(maxCnt) {
    this.maxCnt = maxCnt;

    this.text = new Text();

    this.center = {
      x: 0,
      y: 0
    };

    this.texture = PIXI.Texture.from("particle.png");

    this.beforeParticles = [];
    this.particles = [];

    this.mouse = {
      x: 0,
      y: 0,
      radius: 100,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
  }

  show(alpha, stageWidth, stageHeight, stage) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    this.pos = this.text.setText(alpha, 2, stageWidth, stageHeight);

    this.container = new PIXI.ParticleContainer(this.pos.length, {
      vertices: false,
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: false,
    });
    stage.addChild(this.container);

    this.beforeParticles = this.shuffle(this.particles);
    this.particles = [];
    if (this.pos.length <= this.beforeParticles.length) {
      for (let i = 0; i < this.pos.length; i++) {
        const item = new Particle(this.pos[i], this.texture);
        item.x = this.beforeParticles[Math.ceil(i * this.beforeParticles.length / this.pos.length)].x;
        item.y = this.beforeParticles[Math.ceil(i * this.beforeParticles.length / this.pos.length)].y;
        this.container.addChild(item.sprite);
        this.particles.push(item);
      }
    } else {
      if (this.beforeParticles.length == 0) {
        for (let i = 0; i < this.pos.length; i++) {
          const item = new Particle(this.pos[i], this.texture);
          this.container.addChild(item.sprite);
          this.particles.push(item);
        }
      } else {
        for (let i = 0; i < this.pos.length; i++) {
          const item = new Particle(this.pos[i], this.texture);
          item.x = this.beforeParticles[Math.ceil(i * this.beforeParticles.length / this.pos.length)].x;
          item.y = this.beforeParticles[Math.ceil(i * this.beforeParticles.length / this.pos.length)].y;
          this.container.addChild(item.sprite);
          this.particles.push(item);
        }
      }
    }
  }

  animate(cnt) {
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      item.savedX = item.initX;
      item.savedY = item.initY;
      const dx = this.mouse.x - item.x;
      const dy = this.mouse.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x + Math.cos(angle) * minDist;
        const ty = item.y + Math.sign(angle) * minDist;
        const ax = tx - this.mouse.x;
        const ay = ty - this.mouse.y;
        item.vx -= ax;
        item.vy -= ay;
      }

      item.draw();
    }
  }

  onMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onTouchEnd() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }

  shuffle(inputArr) {
    const arr = inputArr;

    for (let i = arr.length - 1; i > 0; i--) {
      const randomPos = Math.floor(Math.random() * (i + 1));

      const temp = arr[i];
      arr[i] = arr[randomPos];
      arr[randomPos] = temp;
    }

    return arr;
  }
}
