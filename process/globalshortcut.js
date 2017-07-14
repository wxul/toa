const electron = require('electron');
const globalShortcut = electron.globalShortcut;

module.exports.registershortcuts = function (mainWindow) {
    globalShortcut.register('CommandOrControl+Alt+Q', function () {
        mainWindow.webContents.send('print-screen-pressed');
    })

    globalShortcut.register('Alt+A', function () {
        mainWindow.webContents.send('print-screen-color');
    })
};

module.exports.unregistall = function () {
    globalShortcut.unregisterAll();
};