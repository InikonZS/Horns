class Player{
  constructor(name, health, pos, color){
    this.name = name;
    this.health = health;
    this.weapons = [];
    this.currentWeapon = null;
    this.shotDirection;

    this.graphic = new GraphicPlayer(pos, 10, color);
    this.angle = 0;
    this.target = new GraphicPoint(pos, 5, color);
    
   // this.bullets = [];
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

  shot(){
    if (this.currentWeapon){
      this.currentWeapon.shot();
      this.onShot();
    }

    let dir = new Vector(Math.cos(this.angle / 100), Math.sin(this.angle / 100));
    let bullet = new Physical(this.graphic.position.clone().add(dir.clone().scale(11)), 5, '#000');
    bullet.physic.speed = dir.clone().scale(10.1);
    bullets.push(bullet);
    bullet.timer.onTimeout=()=>{
      bullets = bullets.filter(it=>it!==bullet);
    }
  }

  render(context, deltaTime){
    this.target.position = new Vector(Math.cos(this.angle / 100), Math.sin(this.angle / 100)).scale(100).add(this.graphic.position)
    this.graphic.render(context, deltaTime, {health:this.health});
    bullets.forEach(it=>{
      //it.render(context, deltaTime);
      if (it.graphic.position.clone().sub(this.graphic.position).abs()<10){
        if (!it.isDeleted){
          it.isDeleted = true;
          this.hurt(70);
        }
      }
    });
    bullets = bullets.filter(it=>!it.isDeleted)
    if (this.isActive){
      this.target.render(context, deltaTime);
    }
  }
}

module.exports = Player;