"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const installing_1 = require("./installing");
let mainWindow;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
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
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
electron_1.ipcMain.on("message-from-renderer", (event, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (value == "start") {
        yield (0, installing_1.Installing)(event);
    }
    else if (value == "close") {
        electron_1.app.quit();
    }
}));
