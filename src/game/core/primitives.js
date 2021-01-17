const Timer = require('./timer.js');
const Vector = require('common/vector.js');

class GraphicPoint {
  constructor(position, radius, color = '#f00') {
    //super();
    this.position = position.clone();
    //this.physic = new PhysicPoint(position);
    this.radius = radius;
    this.color = color;
  }

  render(context, deltaTime, camera) {
    let position = this.position.clone().add(camera);
    context.fillStyle = this.color;
    context.strokeStyle = '#FFF';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(position.x, position.y, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.stroke();
    //super.render(context, deltaTime);
  }
}

class PhysicPoint {
  constructor(position) {
    this.position = position.clone();
    this.speed = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    this.forceList = [];
    this.friction = 1;
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  set x(value) {
    this.position.x = value;
  }
  set y(value) {
    this.position.y = value;
  }

  getNextPosition(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach((it) => resultAcceleration.add(it));
    this.speed
      .clone()
      .add(resultAcceleration.clone().scale(deltaTime))
      .scale(this.friction);
    return this.position.clone().add(this.speed.clone().scale(deltaTime));
  }

  getPosition(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach((it) => resultAcceleration.add(it));
    // this.speed.clone().add(resultAcceleration.clone().scale(deltaTime)).scale(this.friction);
    return this.position
      .clone()
      .add(this.speed.clone().scale(deltaTime))
      .add(resultAcceleration.scale(deltaTime ** 2 / 2));
  }

  process(deltaTime) {
    let resultAcceleration = this.acceleration.clone();
    this.forceList.forEach((it) => resultAcceleration.add(it));
    this.speed
      .add(resultAcceleration.clone().scale(deltaTime))
      .scale(this.friction);
    this.position.add(this.speed.clone().scale(deltaTime));
  }

  reflect(normal, scaler=1){
    if (!normal || normal.abs() == 0) {
      this.speed.scale(-1);
    } else {
      this.speed.from(this.speed.reflect(normal).scale(scaler));
    }
  }
}

class Physical {
  constructor(pos, radius, color) {
    this.graphic = new GraphicPoint(pos, radius, color);
    this.physic = new PhysicPoint(pos);
    //this.physic1 = new PhysicPoint(pos);
    this.timer = new Timer();
    this.timer.start(10);
    this.isReflectable = false;
  }

  render(context, deltaTime, camera, proc) {
    this.timer.tick(deltaTime);
    !proc && this.physic.process(deltaTime);
    this.graphic.position = this.physic.position;
    this.graphic.render(context, deltaTime, camera);

    context.fillStyle = '#000';
    let position = this.graphic.position.clone().add(camera);
    context.fillText(
      Math.trunc(this.timer.counter),
      position.x - context.measureText(Math.trunc(this.timer.counter)).width / 2,
      position.y - 15,
    );
  }

  trace(map, camera, context) {
    if (context) {
      context.strokeStyle = '#000';
      context.beginPath();
    }

    let prev = this.physic.position.clone();
    for (let i = 1; i < 100; i += 1) {
      let current = this.physic.getPosition(i);
      let c = current.clone().add(camera.position);
      context && context.lineTo(c.x, c.y);
      let nearest = map.getNearIntersection(prev, current);
      if (nearest) {
        // console.log(nearest);
        context && context.stroke();
        return nearest;
      }
      prev = current;
    }
    context && context.stroke();
  }
}

module.exports = { GraphicPoint, PhysicPoint, Physical };
