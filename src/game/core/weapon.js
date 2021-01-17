const { GraphicPoint, PhysicPoint, Physical } = require('./primitives.js');
const Vector = require('common/vector.js');
const Timer = require('./timer.js');

class Weapon {
  constructor(bulletSpeed, gravitable = false) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
  }

  shot(bullets, point, direction, power = 5) {
    makeBullet = (cnt) => {
      let bullet = new Physical(
        point.clone().add(direction.clone().scale(11)),
        5,
        '#000',
      );
      if (this.gravitable) {
        bullet.physic.acceleration.y = 0.5;
      }
      bullet.physic.speed = direction
        .clone()
        .scale(this.bulletSpeed * ((5 + 1 + Math.random() * 3) / 2));
      bullets.list.push(bullet);
      bullet.timer.counter = 40;
      bullet.magnitude = 5;
      bullet.timer.onTimeout = () => {
        bullet.isDeleted = true;
      };
      bullet.timer.onTick = (counter) => {
        if (cnt > 0 && counter < 39) {
          bullet.timer.onTick = null;
          makeBullet(cnt - 1);
        }
      };
    };
    makeBullet(5);
  }
}

class WeaponS {
  constructor(bulletSpeed, gravitable = false) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
  }

  shot(bullets, point, direction, power = 5) {
    let bullet = new Physical(
      point.clone().add(direction.clone().scale(11)),
      5,
      '#000',
    );
    if (this.gravitable) {
      bullet.physic.acceleration.y = 1;
    }
    bullet.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * ((power + 1) / 2));
    bullets.list.push(bullet);
    bullet.timer.counter = 80;
    bullet.magnitude = 50;
    bullet.timer.onTimeout = () => {
      bullet.isDeleted = true;
    };
  }
}

class WeaponEx {
  constructor(bulletSpeed, gravitable = false) {
    this.bulletSpeed = bulletSpeed;
    this.gravitable = gravitable;
    this.isDeleted = false;
    this.tracer = new Physical(new Vector(0, 0), 3, 'red');
  }

  setShotOptions(point, direction, power = 0, wind) {
    this.tracer.physic.position.from(point);
    if (this.gravitable) {
      this.tracer.physic.acceleration.y = 3;
      this.tracer.physic.acceleration.x = wind / 3;
    }
    this.tracer.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * (power + 1));
  }

  shot(bullets, point, direction, power = 5, wind) {
    let bullet = new Physical(
      point.clone().add(direction.clone().scale(11)),
      5,
      '#000',
    );
    if (this.gravitable) {
      bullet.physic.acceleration.y = 3;
      bullet.physic.acceleration.x = wind / 3;
    }
    bullet.physic.speed = direction
      .clone()
      .scale(this.bulletSpeed * (power + 1));

    bullets.list.push(bullet);
    bullet.timer.counter = 140;
    bullet.timer.onTimeout = () => {
      for (let i = 0; i < 5; i++) {
        //let bull = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
        let bull = new Physical(
          bullet.graphic.position.clone().add(direction.clone().scale(11)),
          5,
          '#000',
        );
        bull.physic.acceleration.y = 1;
        // bull.physic.acceleration.x = wind/3;
        bull.physic.speed = direction.clone().scale(0.1 + 2 * i);
        bullets.list.push(bull);
        bull.timer.counter = 80;
        bull.timer.onTimeout = () => {
          bull.isDeleted = true;
        };
        //console.log(bullets);
      }
      bullet.isDeleted = true;
    };
  }
}

module.exports = { WeaponEx, Weapon, WeaponS };
