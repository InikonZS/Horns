const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');
const Timer = require('./timer.js');

class Weapon{
  constructor(bulletSpeed, gravitable = false){
    this.bulletSpeed = bulletSpeed;  
    this.gravitable = gravitable;
    this.isDeleted = false; 
  }

  shot(bullets, point, direction, power = 5){
    makeBullet = (cnt)=>{
      let bullet = new Physical(point.clone().add(direction.clone().scale(11)), 5, '#000');
      if (this.gravitable){
        bullet.physic.acceleration.y = 0.5;
      }
      bullet.physic.speed = direction.clone().scale(this.bulletSpeed*((5+1+Math.random())/2));
      bullets.list.push(bullet);
      bullet.timer.counter = 40;
      bullet.magnitude = 5;
      bullet.timer.onTimeout=()=>{
        bullet.isDeleted = true;
      }
      bullet.timer.onTick = (counter)=>{
        if (cnt>0 && counter<39){
          bullet.timer.onTick = null;
          makeBullet(cnt-1);
        }
      }
    }
    makeBullet(5);
  }
}

class WeaponS{
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
    bullet.physic.speed = direction.clone().scale(this.bulletSpeed*((power+1)/2));
    bullets.list.push(bullet);
    bullet.timer.counter = 80;
    bullet.magnitude = 50;
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


module.exports = {WeaponEx, Weapon, WeaponS};