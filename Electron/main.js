const { app, BrowserWindow, ipcMain  } = require('electron');
const package = require('./package.json');
const DEV = !!package.devDependencies;
global.DEV = DEV;
global.version = package.version;

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800, height: 600, 'min-width': 1000, 'min-height': 600, webPreferences: {
      nodeIntegration: true
    }, show: false
  });
  win.setMenu(null);
  win.maximize();

  win.webContents.on('did-finish-load', function () {
    win.setMinimumSize(1000, 600);
    win.show();
  });

  if(DEV){
    win.loadURL(`http://localhost:8080/`)
    win.webContents.openDevTools()
  }else{
    win.loadFile('app/index.html')
  }
  
  win.on('closed', () => {
    win = null
  })

}

ipcMain.on('hide-window', (event, arg) => {
  if(win) win.hide()
})

function init(){
    createWindow();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    restart()
  })

  app.on('ready', init)
}


function restart(){
  const exec = require('child_process').exec;
  exec(process.execPath);
  app.quit();
}