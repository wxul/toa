const path = require('path');
const url = require('url');
const glob = require('glob');
const fs = require('fs');
const electron = require('electron');
const req = require('request');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

const app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    globalShortcut = electron.globalShortcut,
    ipc = electron.ipcMain;

let mainWindow;

const debug = process.env.NODE_ENV == 'development';

function createWindow() {
    mainWindow = new BrowserWindow({ width: 880, height: 740 });
    global.mainWindow = mainWindow;

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file",
        slashes: true
    }))

    if (debug) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    })
    // register shortcuts
    // registershortcuts();
}

app.on('ready', function () {
    createWindow();
    if (!debug) {
        // autoUpdater.initialize();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});