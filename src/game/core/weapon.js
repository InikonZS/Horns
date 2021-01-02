const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');

class Weapon{
  constructor(bulletSpeed, gravitable = false){
    this.bulletSpeed = bulletSpeed;  
    this.gravitable = gravitable;
    this.isDeleted = false; 
  }

  shot(bullets, point, direction, power = 5){
    let bullet = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
    if (this.gravitable){
      bullet.physic.acceleration.y = 1;
    }
    bullet.physic.speed = direction.clone().scale(this.bulletSpeed*(power+1));
    bullets.list.push(bullet);
    bullet.timer.counter = 30;
    bullet.timer.onTimeout=()=>{
      bullet.isDeleted = true;
    }
  }
}

class WeaponEx{
  constructor(bulletSpeed, gravitable = false){
    this.bulletSpeed = bulletSpeed;  
    this.gravitable = gravitable;
    this.isDeleted = false; 
  }

  shot(bullets, point, direction, power = 5){

    let bullet = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
    if (this.gravitable){
      bullet.physic.acceleration.y = 1;
      //wind //bullet.physic.acceleration.x = Math.random()*12-6;
    }
    bullet.physic.speed = direction.clone().scale(this.bulletSpeed*(power+1));
    bullets.list.push(bullet);
    bullet.timer.counter = 10;
    bullet.timer.onTimeout=()=>{
      for (let i = 0; i<5; i++){
        //let bull = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
        let bull = new Physical(bullet.graphic.position.clone().add(direction.clone().scale(11)), 5, '#000');
        bull.physic.acceleration.y = 1;
        bull.physic.speed = direction.clone().scale(0.10+2*i);
        bullets.list.push(bull);
        bull.timer.counter=40;
        bull.timer.onTimeout=()=>{
          bull.isDeleted = true;
        }
        //console.log(bullets);
      }
      bullet.isDeleted = true;
    }
  }
}


module.exports = WeaponEx;