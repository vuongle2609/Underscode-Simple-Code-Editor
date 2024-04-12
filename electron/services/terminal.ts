import { BrowserWindow, ipcMain } from "electron";
import * as os from "node:os";
const { spawn } = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const initTerminalService = (win: BrowserWindow) => {
  const ptySessions: Record<string, any> = {};

  const createPtySession = ({ path, id }: { path: string; id: string }) => {
    const currentId = id;

    ptySessions[currentId] = spawn(shell, [], {
      name: "xterm-color",
      cols: 80,
      rows: 30,
      cwd: path,
      env: process.env,
    });

    ptySessions[currentId].on("data", function (data: any) {
      win.webContents.send("terminal.incomingData" + currentId, data);
    });

    ipcMain.on("terminal.keystroke" + currentId, (_, key) => {
      ptySessions[currentId].write(key);
    });
  };

  ipcMain.on("terminal.createSessions", (_, props) => {
    createPtySession(props);
  });
};

export default initTerminalService;
