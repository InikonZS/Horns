const Application = require('./application/application.js');
const config = require('./config.js');
const rootNode = document.getElementById('app');

const application = new Application(rootNode, config);
window.application = application;