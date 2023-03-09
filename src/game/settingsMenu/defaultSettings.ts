import map1 from "../../assets/bitmap3.png";
import map2 from "../../assets/bitmap1.png";
import map3 from "../../assets/bitmap2.png";
import map4 from "../../assets/bitmap.png";

import av4 from "../../assets/avatar_4.jpg";
import av5 from "../../assets/avatar_5.png";
import av6 from "../../assets/avatar_6.jpg";

export const colors = ['#fd434f', '#ffe00d', '#40d04f', '#007bff', '#7b5dfa', '#1abcff', '#f8468d', '#ff7a51'];

export const teams = [
  {
      name: 'Winners',
      avatar: av4,
      playersNumber: 3,
      playersHealts: 200,
      isComputer: true,
      color: '#007bff',
  },
  {
      name: 'Gamers',
      avatar: av5,
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#7b5dfa',
  },
  {
      name: 'Horns',
      avatar: av6,
      playersNumber: 1,
      playersHealts: 200,
      isComputer: true,
      color: '#1abcff',
  },
];


export const mapList = [
  {
      name: 'Island',
      url: map1
  },
  {
      name: 'Desert',
      url: map2
  },
  {
      name: 'City',
      url: map3
  },
  {
      name: 'Underground',
      url: map4
  }
];
