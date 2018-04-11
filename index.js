const { remote } = require('electron')
const { BrowserWindow } = remote

let win = new BrowserWindow({
	width: 800, 
	height: 600
});
console.log('here')
let server = require('./api/server');

win.on('closed', () => {
	win = null;
});

win.loadURL('file://${__dirname}/app/index.html');
