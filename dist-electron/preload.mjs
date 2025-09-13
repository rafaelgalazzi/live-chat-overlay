"use strict";
const electron = require("electron");
const electronHandler = {
  sendMessage(channel, ...args) {
    electron.ipcRenderer.send(channel, ...args);
  },
  on(channel, func) {
    const subscription = (_event, ...args) => func(...args);
    electron.ipcRenderer.on(channel, subscription);
    return () => {
      electron.ipcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel, func) {
    electron.ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
  invoke(channel, ...args) {
    return electron.ipcRenderer.invoke(channel, ...args);
  }
};
electron.contextBridge.exposeInMainWorld("electron", electronHandler);
