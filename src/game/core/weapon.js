const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');

class Weapon{
  constructor(bulletSpeed, gravitable = false){
    this.bulletSpeed = bulletSpeed;  
    this.gravitable = gravitable;
    this.isDeleted = false; 
  }

  shot(bullets, point, direction){
    let bullet = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
    if (this.gravitable){
      bullet.physic.acceleration.y = 1;
    }
    bullet.physic.speed = direction.clone().scale(this.bulletSpeed);
    bullets.push(bullet);
    bullet.timer.onTimeout=()=>{
      bullet.isDeleted = true;
    }
  }
}

module.exports = Weapon;