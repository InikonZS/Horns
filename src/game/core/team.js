class Team{
  constructor(name, avatar, isComputer){
    this.players = [];
    this.name = name;
    this.avatar = avatar;
    this.currentPlayer = null;
    this.isComputer = isComputer;
  }

  nextPlayer(){
    if (this.currentPlayer!==null){
      let nextIndex = (this.players.indexOf(this.currentPlayer)+1) % this.players.length;
      this.currentPlayer = this.players[nextIndex];
    } else {
      this.currentPlayer = this.players[0];
    }
    return this.currentPlayer;
  }

  getSumHealth(){
    return this.players.reduce((a, it)=>a+=+it.health, 0);
  }

  addPlayer(player){
    this.players.push(player);
    player.onKilled = ()=>{
      this.players = this.players.filter(it=>it!=player);
      if (this.players.length==0){
        this.onKilled && this.onKilled();
      }
    }
  }

  react(bullets, deltaTime){
    this.players.forEach(it=>{
      it.react(bullets, deltaTime);
    })
  }

  render(context, deltaTime, camera){
    this.players.forEach(it=>{
      it.render(context, deltaTime, camera);
    })
  }
}

module.exports = Team;