const { app, BrowserWindow, net, protocol } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

protocol.registerSchemesAsPrivileged([
  { scheme: 'buklaki', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } },
]);

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  win.maximize();
  win.once('ready-to-show', () => win.show());
  win.loadURL('buklaki://game/main.html');
}

app.whenReady().then(() => {
  // A standard origin lets menu and game share persistent Web Storage.
  protocol.handle('buklaki', request => {
    try {
      const url = new URL(request.url);
      const file = path.resolve(__dirname, '.' + decodeURIComponent(url.pathname));
      const relative = path.relative(__dirname, file);
      const allowed = relative === 'main.html' || relative === 'game.html' || relative.startsWith(`static${path.sep}`);
      if (url.host !== 'game' || !allowed || path.isAbsolute(relative) || relative.startsWith('..')) {
        return new Response('Not found', { status: 404 });
      }
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405 });
      return net.fetch(pathToFileURL(file).toString(), { method: request.method });
    } catch {
      return new Response('Invalid path', { status: 400 });
    }
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
