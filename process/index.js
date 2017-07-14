const path = require('path');
const url = require('url');
const glob = require('glob');
const fs = require('fs');
const electron = require('electron');
const req = require('request');
const ctxmenu = require('./contextmenu');
const globalShortcut = require('./globalshortcut');

const app = electron.app,
    BrowserWindow = electron.BrowserWindow,
    ipc = electron.ipcMain;

let mainWindow;

const debug = process.env.NODE_ENV == 'development';

function createWindow() {
    mainWindow = new BrowserWindow({ width: 880, height: 740, minWidth: 800, minHeight: 600, fullscreen: false });
    global.mainWindow = mainWindow;

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file",
        slashes: true
    }))
    // mainWindow.setFullScreen(true);
    if (debug) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    })
    // 注册全局热键
    globalShortcut.registershortcuts(mainWindow);
}

app.on('ready', function () {
    createWindow();
    if (!debug) {
        // autoUpdater.initialize();
    }
});
app.on("activate", () => {
    if (mainWindow == null) {
        createWindow();
    }
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 卸载全局热键
app.on('will-quit', function () {
    globalShortcut.unregistall();
})

// 添加右键菜单
ctxmenu.init(app);

// 加载lib
function loadscripts() {
    var files = glob.sync(path.join(__dirname, './lib/*.js'))
    files.forEach(function (file) {
        require(file);
    })
}
loadscripts();