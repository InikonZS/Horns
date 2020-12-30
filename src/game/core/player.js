const Weapon = require('./weapon.js');
const {GraphicPoint, PhysicPoint, Physical} = require('./primitives.js');
const Vector = require('common/vector.js');

class GraphicPlayer extends GraphicPoint{
  constructor (position, radius, color = '#f00'){
    super(position, radius, color);
  }

  render(context, deltaTime, data){
    context.fillStyle = '#000';
    context.fillText(data.health, this.position.x - context.measureText(data.health).width/2, this.position.y-15);
    //context.fillStyle = '#000';
    context.fillText(data.name, this.position.x-context.measureText(data.name).width/2, this.position.y-30);
    
    super.render(context, deltaTime);
  }
}

class Player{
  constructor(name, health, pos, color){
    this.name = name;
    this.health = health;
    this.weapons = [new Weapon(10)];
    this.currentWeapon = this.weapons[0];
    this.angle = 0;

    this.graphic = new GraphicPlayer(pos, 10, color);
    this.target = new GraphicPoint(pos, 5, color);
    
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

  shot(bullets){
    let direction = new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
    if (this.currentWeapon){
      this.currentWeapon.shot(bullets, this.graphic.position, direction);
      this.onShot && this.onShot();
    }
  }

  react(bullets, deltaTime){
    bullets.forEach(it=>{
      if (it.graphic.position.clone().sub(this.graphic.position).abs()<10){
        if (!it.isDeleted){
          it.isDeleted = true;
          this.hurt(70);
        }
      }
    });  
  }

  render(context, deltaTime){
    this.target.position = new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30)).scale(100).add(this.graphic.position)
    this.graphic.render(context, deltaTime, {health:this.health, name:this.name});
    
    if (this.isActive){
      this.target.render(context, deltaTime);
    }
  }
}

module.exports = Player;