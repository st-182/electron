const os = require("os");
const path = require("path");
const Toastify = require("toastify-js");
const { contextBridge, ipcRenderer } = require("electron");
/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

contextBridge.exposeInMainWorld("os", {
  homeDir: () => os.homedir(),
  // node: () => process.versions.node,
  // chrome: () => process.versions.chrome,
  // electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});
contextBridge.exposeInMainWorld("path", {
  join: (...args) => path.join(...args),
});
contextBridge.exposeInMainWorld("Toastify", {
  toast: (params) => Toastify(params).showToast(),
});
contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (e, ...args) => func(...args)),
});
