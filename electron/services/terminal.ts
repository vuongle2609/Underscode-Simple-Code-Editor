import { BrowserWindow, ipcMain } from "electron";

const { spawn } = require("node-pty");

const initTerminalService = (win: BrowserWindow) => {
  const ptySessions: Record<string, any> = {};

  const createPtySession = ({
    path,
    id,
    shell,
  }: {
    path: string;
    id: string;
    shell: string;
  }) => {
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

    ipcMain.on("terminal.resize" + currentId, (_, size) => {
      ptySessions[currentId].resize(size ? size.cols : 1, size ? size.rows : 1);
    });
  };

  ipcMain.on("terminal.createSessions", (_, props) => {
    createPtySession(props);
  });

  ipcMain.on("terminal.destroy", (_, id) => {
    // I dont know why is this not fcking work?
    // try {
    //   ptySessions[id].kill();
    // } catch (err) {
    //   console.log(err.message);
    // }
  });
};

export default initTerminalService;
