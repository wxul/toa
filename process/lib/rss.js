const electron = require('electron');
const ipc = electron.ipcMain;
const fs = require('fs');
const path = require('path');
const BrowserWindow = electron.BrowserWindow;

const RSSPath = path.resolve(__dirname, '../data/rss.json');

// 获取rss列表
ipc.on('rss-getlist', (e) => {
    var result = JSON.parse(fs.readFileSync(RSSPath));
    e.returnValue = result;
});

