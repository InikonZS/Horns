const { Weapon, WeaponEx, WeaponS } = require('./weapon.js');
const { GraphicPoint, PhysicPoint, Physical } = require('./primitives.js');
const Vector = require('common/vector.js');
const Animation = require('./animation');

class GraphicPlayer extends GraphicPoint {
  constructor(position, radius, color = '#f00') {
    super(position, radius, color);
    this.animation = new Animation(
      './assets/worm-walks-100.png',
      1442,
      100,
      15,
      3,
    );
  }

  render(context, deltaTime, camera, data) {
    context.fillStyle = this.color;
    let position = this.position.clone().add(camera);
    context.font = '12px bold "Arial"';
    context.fillText(
      data.health,
      position.x - context.measureText(data.health).width / 2,
      position.y - 20,
    );
    context.fillText(
      data.name,
      position.x - context.measureText(data.name).width / 2,
      position.y - 33,
    );
    super.render(context, deltaTime, camera);
    this.animation.render(
      context,
      deltaTime,
      this.position.clone().add(camera),
    );
  }
}

class Player {
  constructor(name, health, pos, color) {
    this.name = name;
    this.health = health;
    this.weapons = [
      new WeaponEx(10, true, 40),
      new Weapon(10, true),
      new WeaponS(10, true),
      new WeaponEx(10, true, 15),
    ];
    this.currentWeapon = this.weapons[0];
    this.angle = 0;
    this.angleSpeed = 0;

    this.physic = new PhysicPoint(pos);
    this.graphic = new GraphicPlayer(pos, 1, color);
    this.target = new GraphicPoint(pos, 5, color);
    this.powerIndicator = new GraphicPoint(pos, 0, color);
    this.power = 0;
    this.jumped = false;
  }

  setActive(isActive) {
    this.graphic.radius = isActive ? 15 : 10;
    !isActive && this.setMoveAnimation(false);
    this.isActive = isActive;
  }

  setMoveAnimation(value, keyCode) {
    if (value) {
      if (!this.graphic.animation.isStarted) {
        this.graphic.animation.start(keyCode);
      }
    } else {
      this.graphic.animation.stop();
    }
  }

  setWeapon(index) {
    this.currentWeapon = this.weapons[index];
  }

  hurt(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.onKilled();
    }
  }

  cure(damage) {
    this.health += damage;
  }

  powerStart() {
    this.isPower = true;
    this.power = 0;
  }

  powerEnd() {
    this.isPower = false;
    this.power = 0;
  }

  powerUp(deltaTime) {
    if (this.isPower) {
      this.power += deltaTime;
    }
    this.powerIndicator.radius = this.power*2;
    this.powerIndicator.position = this.getDirectionVector()
      .scale(this.power * 20)
      .add(this.graphic.position);
  }

  getDirectionVector() {
    return new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
  }

  shot(bullets, wind) {
    let direction = this.getDirectionVector();
    if (this.currentWeapon) {
      this.currentWeapon.shot(
        bullets,
        this.graphic.position,
        direction,
        this.power,
        wind,
      );
      this.onShot && this.onShot();
      this.powerEnd();
    }
  }

  setShotOptions(wind) {
    let direction = this.getDirectionVector();
    if (this.currentWeapon) {
      this.currentWeapon.setShotOptions(
        this.graphic.position,
        direction,
        this.power,
        wind,
      );
    }
  }

  react(bullets, deltaTime) {
    bullets.list.forEach((it) => {
      if (it.graphic.position.clone().sub(this.graphic.position).abs() < 10) {
        if (!it.isDeleted) {
          //it.isDeleted = true;
          it.timer.counter = 0;
          this.hurt(70);
        }
      }
    });
  }

  render(context, deltaTime, camera) {
    this.graphic.position = this.physic.position;
    this.powerUp(deltaTime);

    if (Math.abs(this.angleSpeed) > 10) {
      this.angleSpeed = Math.sign(this.angleSpeed) * 10;
    }
    this.angle = this.angle + this.angleSpeed * deltaTime;
    this.target.position = this.getDirectionVector()
      .scale(100)
      .add(this.graphic.position);
    this.graphic.render(context, deltaTime, camera, {
      health: this.health,
      name: this.name,
    });
    this.powerIndicator.render(context, deltaTime, camera);
    if (this.isActive) {
      this.target.render(context, deltaTime, camera);
    }
  }

  move(freeMode, moveVector, map, move, tryJump, deltaTime, keyCode) {
    if (freeMode) {
      movePlayerFree(this, moveVector, map);
    } else {
      movePlayer(this, moveVector, map, move, tryJump, deltaTime, keyCode);
    }
  }

  fall(map, deltaTime) {
    fallPlayer(this, map, deltaTime);
  }

  setTargetPoint(playersToHit, camera, map, wind) {
    let minGap = Number.MAX_VALUE;
    let target = 0;
    let speed = 0;
    for (let p = 0; p < playersToHit.length; p++) {
      let player = playersToHit[p];
      for (s = 0; s <= 5; s += 1) {
        this.power = s;
        for (let i = 0; i < Math.PI * 30 * 2; i += (Math.PI * 30 * 2) / 190) {
          this.moveTarget(i);
          this.setShotOptions(wind);
          let targetPoint = this.currentWeapon.tracer.trace(map, camera);

          if (targetPoint) {

            let gap = player.physic.position.clone().sub(targetPoint).abs();
            if (gap < minGap) {
              minGap = gap;
              target = i;
              speed = s;
            }
          }
        }
      }
    }
    this.moveTarget(target);
    this.power = speed;
  }

  moveTarget(angle) {
    this.angle = angle;
  }
}

function fallPlayer(player, map, deltaTime) {
  let it = player;
  if (it.physic.position.y > map.waterLineX) {
    it.hurt(1000);
  }
  it.physic.acceleration.y = 1;
  let nearest = map.getNearIntersection(
    it.physic.position.clone(),
    it.physic.getNextPosition(deltaTime),
    true
  );
  if (!nearest){//(map.isEmptyByVector(it.physic.getNextPosition(deltaTime))) {
    it.physic.process(deltaTime);
  } else {
    it.physic.position.from(nearest);
    it.physic.speed.y = 0;
    it.physic.speed.x = 0;
    it.physic.acceleration.y = 0;
  }
}

function movePlayerFree(player, moveVector, map) {
  let size = map.size;
  let physic = player.physic;
  let s = physic.position.clone().add(moveVector);
  if (map.isEmptyByVector(s)) {
    physic.position = s;
  } else {
    let nextPoint = s.clone().add(new Vector(0, -size * 2));
    if (map.isEmptyByVector(nextPoint)) {
      physic.position.from(nextPoint);
    }
  }
}

function movePlayer(
  player,
  moveVector,
  map,
  move,
  tryJump,
  deltaTime,
  keyCode,
) {
  let size = map.size;
  let physic = player.physic;
  physic.acceleration.y = 1;
  physic.speed.x = moveVector.normalize().scale(5).x;
  if (tryJump && !player.jumped) {
    player.jumped = true;
    physic.speed.y = moveVector.y * 2;
  }
  let s = physic.getNextPosition(deltaTime);

  let nearest = map.getNearIntersection(
    physic.position.clone(),
    s,
    true
  );
  if (!nearest){//map.isEmptyByVector(s)) {
  } else {
    let nextPoint = s.clone().add(new Vector(0, -size * 2));
    if (move && map.isEmptyByVector(nextPoint)){//s.clone().add(new Vector(0, -size * 2)))) {
      physic.position.from(nextPoint);//.add(new Vector(0, -size * 2));
    } else {
      physic.acceleration.y = 0;

      physic.speed.y = 0;
      physic.speed.x = 0;
      player.jumped = false;
    }
  }
  player.setMoveAnimation(move || tryJump, keyCode);
}

module.exports = Player;
