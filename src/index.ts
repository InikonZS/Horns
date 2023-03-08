import Application from './application/application';
import config from './config';
const rootNode = document.getElementById('app');
import "./style.css";
import "./styles/game.css";
import "./scss/main.scss";

const application = new Application(rootNode, config);
(window as any).application = application;