const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// allow hot reload of electron window
require('electron-reload')(__dirname);

// global reference of the window object
// if none, the window will auto close when js object is gc'd
let mainWindow

function createWindow() {
    // create browser window
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800
    })

    // load app index.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // do not show window menu
    mainWindow.setMenu(null);
    // open devtools
    mainWindow.webContents.openDevTools()

    // emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', createWindow)

// quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})