import { app, BrowserWindow, globalShortcut } from "electron";
import * as remoteMain from "@electron/remote/main";
import path from "node:path";
import { ipcMain } from "electron";

import * as os from "node:os";
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let wins: Record<string, BrowserWindow> = {};

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    minWidth: 1024,
    minHeight: 720,
    autoHideMenuBar: true,
    title: "Dori",
    // frame: false,
    webPreferences: {
      preload: "preload.js",
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      plugins: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });
  // win.setMenu(null);
  win.maximize();

  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    // cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.on("data", function (data: any) {
    win.webContents.send("terminal.incomingData", data);
    console.log("Data sent");
  });
  ipcMain.on("terminal.keystroke", (event, key) => {
    console.log("1");
    ptyProcess.write(key);
  });

  remoteMain.enable(win.webContents);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  wins[win.id] = win;
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    wins = {};
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("asynchronous-message", function (evt, message) {
  if (message == "createNewWindow") {
    createWindow();
  }

  if (message == "quitCurrentWindow") {
    wins[evt.sender.id].close();
  }
});

// app.on("ready", () => {
//   globalShortcut.register("CommandOrControl+W", () => {
//     //stuff here
//   });
// });

app.whenReady().then(createWindow);
