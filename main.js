// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";
function createMainWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    name: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Open devTools if in dev env.
  isDev && mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
function createAboutWindow() {
  // Create the browser window.
  const aboutWindow = new BrowserWindow({
    name: "Image Resizer",
    width: 300,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  aboutWindow.loadFile(path.join(__dirname, "renderer/about.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      { label: "Quit", click: () => app.quit(), accelerator: "CmdOrCtrl + W" },
    ],
  },

  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
];
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (!isMac) app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
