const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

module.exports.init = function (app) {
    const menu = new Menu();
    menu.append(new MenuItem({ label: '复制', role: 'copy', accelerator: 'CommandOrControl+C' }));
    menu.append(new MenuItem({ label: '粘贴', role: 'paste', accelerator: 'CommandOrControl+V' }));
    
    app.on('browser-window-created', function (event, win) {
        win.webContents.on('context-menu', function (e, params) {
            menu.popup(win, params.x, params.y)
        })
    })
}