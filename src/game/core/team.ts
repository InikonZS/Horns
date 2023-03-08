import Vector from "common/vector";
import BulletList from "./bulletList";
import Camera from "./camera";
import Player from "./player";

export default class Team{
  players: Player[];
  name: string;
  avatar: string;
  currentPlayer: Player;
  isComputer: boolean;
  color: string;
  onKilled: () => void;

  constructor(name: string, avatar: string, isComputer: boolean, color: string){
    this.players = [];
    this.name = name;
    this.avatar = avatar;
    this.currentPlayer = null;
    this.isComputer = isComputer;
    this.color = color;
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

  addPlayer(player: Player){
    this.players.push(player);
    player.onKilled = ()=>{
      this.players = this.players.filter(it=>it!=player);
      if (this.players.length==0){
        this.onKilled && this.onKilled();
      }
    }
  }

  react(bullets: BulletList, deltaTime: number){
    this.players.forEach(it=>{
      it.react(bullets, deltaTime);
    })
  }

  render(context: CanvasRenderingContext2D, deltaTime: number, camera: Vector){
    this.players.forEach(it=>{
      it.render(context, deltaTime, camera);
    })
  }
}
