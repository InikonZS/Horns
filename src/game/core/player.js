const { Weapon, WeaponEx, WeaponS } = require('./weapon.js');
const { GraphicPoint, PhysicPoint, Physical } = require('./primitives.js');
const Vector = require('common/vector.js');
const Animation = require('./animation');

class GraphicPlayer extends GraphicPoint {
  constructor(position, radius, color = '#f00') {
    super(position, radius, color);
    this.animation = new Animation('./assets/worm-walks-100.png', 1442, 100, 15, 3);
  }

  render(context, deltaTime, camera, data) {
    context.fillStyle = '#000';
    let position = this.position.clone().add(camera);
    context.fillText(
      data.health,
      position.x - context.measureText(data.health).width / 2,
      position.y - 15,
    );
    context.fillText(
      data.name,
      position.x - context.measureText(data.name).width / 2,
      position.y - 30,
    );
    super.render(context, deltaTime, camera);
    this.animation.render(context, deltaTime, this.position.clone().add(camera));

  }
}

class Player {
  constructor(name, health, pos, color) {
    this.name = name;
    this.health = health;
    this.weapons = [
      new WeaponEx(10, true),
      new Weapon(10, true),
      new WeaponS(10, true),
    ];
    this.currentWeapon = this.weapons[0];
    this.angle = 0;
    this.angleSpeed = 0;

    this.physic = new PhysicPoint(pos);
    this.graphic = new GraphicPlayer(pos, 10, color);
    this.target = new GraphicPoint(pos, 5, color);
    this.powerIndicator = new GraphicPoint(pos, 5, color);
    this.power = 0;
    this.jumped = false;
    this.isComputer = false;
  }

  setActive(isActive){
    this.graphic.radius= isActive ? 15 : 10;
    !isActive && this.setMoveAnimation(false);
    this.isActive = isActive;
  }

  setMoveAnimation(value, keyCode){
    if (value){
      if (!this.graphic.animation.isStarted){
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
    this.powerIndicator.position = this.getDirectionVector()
      .scale(this.power * 20)
      .add(this.graphic.position);
  }

  getDirectionVector() {
    if (!this.isComputer) {
      return new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
    } else {
      return new Vector(Math.cos(this.angle / 30), Math.sin(this.angle / 30));
    }

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
        // this.power,
        5,
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
    //this.physic.acceleration.y=0.1;
    //this.physic.process(deltaTime);
    if (this.physic.position.y > 1000) {
      this.hurt(1000);
    }
    this.graphic.position = this.physic.position;
    this.powerUp(deltaTime);

    if (Math.abs(this.angleSpeed)>10){
      this.angleSpeed = Math.sign(this.angleSpeed)*10;
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

  move(freeMode, moveVector, map, move, tryJump, deltaTime, keyCode){
    if(freeMode){
      movePlayerFree(this, moveVector, map);
    } else {
      movePlayer(this, moveVector, map, move, tryJump, deltaTime, keyCode);
    }
  }

  fall(map, deltaTime){
    fallPlayer(this, map, deltaTime);
  }
}

function fallPlayer(player, map, deltaTime){
  let it = player;
  it.physic.acceleration.y=1;
  if (map.isEmptyByVector(it.physic.getNextPosition(deltaTime))){
    it.physic.process(deltaTime);
  } else {
    it.physic.speed.y=0;
    it.physic.speed.x=0;
    it.physic.acceleration.y=0;
  }
}

function movePlayerFree(player, moveVector, map){
  let size = map.size;
  let physic = player.physic;
  let s = physic.position.clone().add(moveVector);
  if (map.isEmptyByVector(s)){
    physic.position = s;
  } else {
    if (map.isEmptyByVector(s.clone().add(new Vector(0,-size*2)))){
      physic.position = s.clone().add(new Vector(0,-size*2));
    }
  }
}

function movePlayer(player, moveVector, map, move, tryJump, deltaTime, keyCode){
  let size = map.size;
  let physic = player.physic;
  physic.acceleration.y=1;
  physic.speed.x = moveVector.normalize().scale(5).x;
  if (tryJump && !player.jumped){
    player.jumped = true;
    physic.speed.y=moveVector.y*2;
  }
  let s = physic.getNextPosition(deltaTime);
  if (map.isEmptyByVector(s)){
  } else {
    if (move && map.isEmptyByVector(s.clone().add(new Vector(0,-size*2)))){
      physic.position.add(new Vector(0,-size*2));
    } else {
      physic.acceleration.y=0;
      physic.speed.y=0;
      physic.speed.x=0;
      player.jumped=false;
    }
  }
  player.setMoveAnimation(move || tryJump, keyCode);
}

module.exports = Player;
