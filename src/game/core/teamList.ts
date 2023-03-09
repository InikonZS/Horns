import Vector from "common/vector";
import Camera from "./camera";
import { GameMap } from "./map";
import Player from "./player";
import Team from "./team";

export default class TeamList {
  list: Team[];
  currentTeam: Team;
  onLastTeam: () => void;

  constructor (){
    this.list = [];
    this.currentTeam = null;
    this.onLastTeam = ()=>{}
  }

  add(team: Team){
    this.list.push(team);
    team.onKilled = () => {
      if (this.getActiveTeams().length <= 1) {
        this.onLastTeam && this.onLastTeam();
      }
    };
  }

  getActiveTeams() {
    return this.list.filter((it) => it.isAlive());
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
    let playerList: Array<Player> = [];
    this.list.forEach((team) =>
      team.players.forEach((it) => {
        playerList.push(it);
      }),
    );
    return playerList;
  }

  nextTeam(teamIndex?: number){
    let nextTeamIndex = teamIndex;
    if (teamIndex === undefined) {
      nextTeamIndex =
        (this.list.indexOf(this.currentTeam) + 1) % this.list.length;
      while (!this.list[nextTeamIndex].isAlive()) {
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

  process(map: GameMap, deltaTime: number){
    this.getPlayerList().forEach((player) => {
      player.fall(map, deltaTime);
    });
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector){
    this.list.forEach((it) => {
      it.render(context, deltaTime, camera);
    });
  }

  getSumHealth(){
    return this.list.reduce((allHealth, team) => allHealth += team.getSumHealth(), 0);
  }
}