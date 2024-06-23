import { app, BrowserWindow, ipcMain } from 'electron';
import { Installing } from "./installing";

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
    },
    autoHideMenuBar: true,
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("htdocs/run.html");

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("message-from-renderer", async (event : Electron.IpcMainEvent, value)=>{
  if ( value == "start") {
    await Installing(event);
  }
  else if (value == "close") {
    app.quit();
  }
});