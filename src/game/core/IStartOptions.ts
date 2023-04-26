import { ITeamItemData } from "../ITeamItemData";

export interface IStartOptions {
    format?: string; 
    mapURL: string; 
    nameList: string[]; 
    colorList?: string[]; 
    teams: ITeamItemData[];
}