import { IWeapon } from "./weapons/IWeapon";
import { Weapon } from "./weapons/weapon";
import { WeaponEx } from "./weapons/weaponEx";
import { WeaponS } from "./weapons/weaponS";

export function getWeaponList(): Array<IWeapon>{
   return [
    new WeaponEx(10, true, 40),
    new Weapon(10, true),
    new WeaponS(10, true),
    new WeaponEx(10, true, 15),
  ] 
}