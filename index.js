const electron = require('electron')
const { app, BrowserWindow, ipcMain, Tray, remote, Menu, screen, shell, nativeImage} = require('electron/main')
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
		icon: __dirname + '/icon/256x256.png',
    width: 800,
    height: 600,
		frame: false,
		titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'app/preload.js'),
			contextIsolation: false,
			nodeIntegration: false,
			nodeIntegrationInWorker: true,
			devTools: true,
    }
  })
  win.loadURL('http://localhost/');
	ipcMain.on("miniminze", (event, a) => {
		win.minimize();
	});
	ipcMain.on("chrome", (event, a) => {
		shell.openExternal(a)
	});
	ipcMain.on("maximinze", (event, a) => {
		if (win.isMaximized()==false){
			win.maximize();
		} else {
			win.unmaximize();
		}
	});
  ipcMain.on('close', (evt, arg) => {
    win.hide()
  })
  ipcMain.on('exit', (evt, arg) => {
    app.quit()
  })
	ipcMain.on("popup",async (event, a) => {
		console.log(a);
	});
	// Tray
	
	var contextMenu = Menu.buildFromTemplate([
    { label: 'Mở app', click:  function(){
        win.show();
    } },
    { label: 'Thoát', click:  function(){
			app.isQuiting = true;
			app.quit();
    } }
	])
  appIcon = new Tray(__dirname + '/icon/256x256.png')
  contextMenu.items[1].checked = false
	appIcon.setIgnoreDoubleClickEvents(true)
  appIcon.setContextMenu(contextMenu)
	appIcon.on('double-click',() => {
		win.show();
	});
}
app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}