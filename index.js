const {BrowserWindow} = require('electron');

let win = new BrowserWindow({width: 800, height: 600});
win.on('closed', () => {
	win = null;
});

win.loadURL('file://${__dirname}/app/index.html');
