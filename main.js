// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");
const ResizeImg = require("resize-img");
const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";
console.dir(process.env);

let mainWindow;
function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    name: "Image Resizer",
    width: isDev ? 1000 : 500,
    height: 500,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
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
    name: "About Image Resizer",
    width: 300,
    height: 300,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
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
  mainWindow.on("closed", () => (mainWindow = null));
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// respond to ipcRenderer resize
ipcMain.on("image:resize", (e, options) => {
  // console.dir(options);
  options.dest = path.join(os.homedir(), "imageresizer");
  resizeImage(options);
});

//
const resizeImage = async ({ imagePath, width, height, dest }) => {
  try {
    const newPath = await ResizeImg(fs.readFileSync(imagePath), {
      width: +width,
      height: +height,
    });
    const fileName = path.basename(imagePath);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.writeFileSync(path.join(dest, fileName), newPath);
    mainWindow.webContents.send("image:done");
    shell.openPath(dest);
  } catch (error) {
    console.log(error);
  }
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (!isMac) app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
