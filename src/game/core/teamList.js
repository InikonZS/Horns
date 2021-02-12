class TeamList {
  constructor (){
    this.list = [];
    this.currentTeam = null;
    this.onLastTeam = ()=>{}
  }

  add(team){
    this.list.push(team);
    team.onKilled = () => {
      if (this.getActiveTeams().length <= 1) {
        this.onLastTeam && this.onLastTeam();
      }
    };
  }

  getActiveTeams() {
    return this.list.filter((it) => it.players.length);
  }

  getPlayersToHit() {
    return this.list
      .filter((it) => it !== this.currentTeam)
      .reduce((list, it) => list.concat(it.players), []);
  }

  getCurrentPlayer() {
    return this.currentTeam.currentPlayer;
  }

  getPlayerList() {
    let playerList = [];
    this.list.forEach((team) =>
      team.players.forEach((it) => {
        playerList.push(it);
      }),
    );
    return playerList;
  }

  nextTeam(teamIndex){
    let nextTeamIndex = teamIndex;
    if (teamIndex === undefined) {
      nextTeamIndex =
        (this.list.indexOf(this.currentTeam) + 1) % this.list.length;
      while (!this.list[nextTeamIndex].players.length) {
        nextTeamIndex = (nextTeamIndex + 1) % this.list.length;
      }
    }

    this.currentTeam = this.list[nextTeamIndex];
    let currentPlayer = this.currentTeam.nextPlayer();
    this.getPlayerList().forEach((jt) => {
      jt.setActive(false);
    });
    currentPlayer.setActive(true);
    return currentPlayer;
  }

  process(map, deltaTime){
    this.getPlayerList().forEach((player) => {
      player.fall(map, deltaTime);
    });
  }

  render(context, deltaTime, camera){
    this.list.forEach((it) => {
      it.render(context, deltaTime, camera);
    });
  }

  getSumHealth(){
    return this.list.reduce((allHealth, team) => allHealth += team.getSumHealth(), 0);
  }
}

module.exports = TeamList;