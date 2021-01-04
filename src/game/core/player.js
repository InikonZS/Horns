const {Weapon, WeaponEx, WeaponS} = require('./weapon.js');
const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');

class GraphicPlayer extends GraphicPoint{
  constructor (position, radius, color = '#f00'){
    super(position, radius, color);
  }

  render(context, deltaTime, camera, data){
    context.fillStyle = '#000';
    let position = this.position.clone().add(camera);
    context.fillText(data.health, position.x - context.measureText(data.health).width/2, position.y - 15);
    context.fillText(data.name, position.x - context.measureText(data.name).width/2, position.y - 30);
    
    super.render(context, deltaTime, camera);
  }
}

class Player{
  constructor(name, health, pos, color){
    this.name = name;
    this.health = health;
    this.weapons = [new WeaponEx(10, true), new Weapon(10, true), new WeaponS(10, true)];
    this.currentWeapon = this.weapons[0];
    this.angle = 0;

    this.physic = new PhysicPoint(pos);
    this.graphic = new GraphicPlayer(pos, 10, color);
    this.target = new GraphicPoint(pos, 5, color);
    this.powerIndicator = new GraphicPoint(pos, 5, color);
    this.power = 0;
  }

  setWeapon(index){
    this.currentWeapon = this.weapons[index];
  }

  hurt(damage){
    this.health -= damage;
    if (this.health <= 0 ){
      this.health = 0;
      this.onKilled();
    }
  }

  cure(damage){
    this.health += damage;
  }

  powerStart(){
    this.isPower = true;
    this.power = 0;
  }

  powerEnd(){
    this.isPower = false;
    this.power = 0;
  }

  powerUp(deltaTime){
    if (this.isPower){
      this.power+=deltaTime;
    }
    this.powerIndicator.position = this.getDirectionVector().scale(this.power*20).add(this.graphic.position);
  }

  getDirectionVector(){
    return new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
  }

  shot(bullets){
    let direction = this.getDirectionVector();
    if (this.currentWeapon){
      this.currentWeapon.shot(bullets, this.graphic.position, direction, this.power);
      this.onShot && this.onShot();
      this.powerEnd();
    }
  }

  react(bullets, deltaTime){
    bullets.list.forEach(it=>{
      if (it.graphic.position.clone().sub(this.graphic.position).abs()<10){
        if (!it.isDeleted){
          //it.isDeleted = true;
          it.timer.counter = 0;
          this.hurt(70);
        }
      }
    });  
  }

  render(context, deltaTime, camera){
    //this.physic.acceleration.y=0.1;
    //this.physic.process(deltaTime);
    if (this.physic.position.y>1000){
      this.hurt(1000);
    }
    this.graphic.position = this.physic.position;
    this.powerUp(deltaTime);
    this.target.position = this.getDirectionVector().scale(100).add(this.graphic.position)
    this.graphic.render(context, deltaTime, camera, {health:this.health, name:this.name});
    this.powerIndicator.render(context, deltaTime, camera);
    if (this.isActive){
      this.target.render(context, deltaTime, camera);
    }
  }
}

module.exports = Player;