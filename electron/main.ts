import { app, BrowserWindow, ipcMain, screen, Menu } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TwitchService } from './src/live/TwitchService';
import { AuthService } from './src/auth/AuthService';
import { HttpServer } from './src/server/HttpServer';
import { TwitchEmoteService } from './src/live/TwitchEmoteService';
import { appState } from './src/state/AplicationState';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let envPath: string;
if (process.env.NODE_ENV === 'development') {
  // Em dev, usa o arquivo .env da raiz do projeto
  envPath = path.join(__dirname, '..', '.env');
} else {
  // Em produção, usa o arquivo .env copiado para resources/
  envPath = path.join(process.resourcesPath, '.env');
}

require('dotenv').config({ path: envPath });

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '';
export const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || '';
export const TWITCH_APP_NAME = process.env.TWITCH_APP_NAME || '';
export const ELECTRON_STORE_KEY = process.env.ELECTRON_STORE_KEY || '';

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;
let chatWindow: BrowserWindow | null = null;

// usamos o mesmo preload para todas as janelas
const preloadPath = path.join(__dirname, 'preload.mjs');

const authService = new AuthService(ELECTRON_STORE_KEY);

const emoteService = new TwitchEmoteService(TWITCH_CLIENT_ID, authService);

const twitchService = new TwitchService(
  TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET,
  TWITCH_APP_NAME,
  authService,
  'http://localhost:37250/auth/callback',
  ['chat:read', 'chat:edit']
);

ipcMain.handle('oauth', async () => {
  const authUrl = await twitchService.getAuthUrl();
  const httpServer = new HttpServer(37250);

  httpServer.start();

  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      center: true,
      webPreferences: { nodeIntegration: false },
    });

    win.loadURL(authUrl);

    win.webContents.on('will-navigate', async (event, url) => {
      if (url.startsWith('http://localhost:37250/auth/callback')) {
        event.preventDefault();
        const code = new URL(url).searchParams.get('code');
        if (code) {
          try {
            await twitchService.exchangeCodeForToken(code);
            resolve(true);
          } catch (err) {
            reject(err);
          } finally {
            httpServer.stop();
          }
        }
        win.close();
      }
    });
  });
});

ipcMain.handle('verifyAutentication', () => {
  return authService.verifyAuth();
});

function createChatWindow(route = '/overlay') {
  if (chatWindow) return chatWindow;

  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;
  const winWidth = 500;
  const winHeight = 500;

  chatWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: screenWidth - winWidth, // posição para canto direito
    y: 0, // canto superior
    center: true,
    show: false,
    frame: false, // sem borda
    transparent: true, // fundo transparente
    alwaysOnTop: true, // sempre no topo
    skipTaskbar: true, // não aparece na barra de tarefas
    focusable: false, // não pode receber foco
    hasShadow: false, // remove sombra (opcional)
    webPreferences: {
      preload: preloadPath,
    },
  });

  // chatWindow.setContentProtection(true);

  if (VITE_DEV_SERVER_URL) {
    chatWindow.loadURL(`${VITE_DEV_SERVER_URL}#${route}`);
  } else {
    chatWindow.loadFile(path.join(RENDERER_DIST, 'index.html'), {
      hash: route.replace(/^\//, ''),
    });
  }

  chatWindow.once('ready-to-show', () => {
    if (chatWindow) {
      chatWindow.show();
      chatWindow.setIgnoreMouseEvents(true, { forward: true }); // sem interação
    }
  });

  chatWindow.on('closed', () => {
    chatWindow = null;
  });

  return chatWindow;
}

ipcMain.handle('start-chat', async (_, data: { username: string }) => {
  appState.setState({ channel: data.username });
  const chatClient = twitchService.startTmiClient(data.username);
  if (!chatClient) return;

  const broadcasterId = await twitchService.getBroadcasterId(data.username);
  if (broadcasterId) appState.setState({ broadcasterId });

  chatClient.connect();

  console.log('Chat connected!');

  chatWindow = createChatWindow();
  chatWindow.setOpacity(0.6);

  chatClient.on('message', (_, tags, message, self) => {
    if (self) return;
    chatWindow?.webContents.send('update-chat', { message, tags });
  });
});

ipcMain.handle('stop-chat', () => {
  twitchService.stopTmiClient();
  if (chatWindow) {
    chatWindow.close();
    chatWindow = null;
  }
  appState.reset();
});

ipcMain.handle('get-badges-map', async () => {
  const accessToken = authService.getAuthToken();
  const { broadcasterId } = appState.getState();
  if (!accessToken || !broadcasterId) return {};

  return await emoteService.getAllChannelBadges(broadcasterId);
});

ipcMain.handle('get-emotes-map', async () => {
  const accessToken = authService.getAuthToken();
  const { broadcasterId } = appState.getState();
  if (!accessToken || !broadcasterId) return {};

  return await emoteService.getAllChannelEmotes(broadcasterId);
});

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: preloadPath,
    },
  });

  // Close the chat window if the main window is closed
  win.on('close', () => {
    if (chatWindow) {
      chatWindow.close();
      chatWindow = null;
    }
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (!VITE_DEV_SERVER_URL) Menu.setApplicationMenu(null);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
