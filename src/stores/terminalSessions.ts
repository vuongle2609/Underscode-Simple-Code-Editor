import { terminalTheme } from "@/config/theme";
import { useFolderStore } from "@/stores/folder";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { ipcRenderer } from "electron";
import * as os from "node:os";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { computed, ref } from "vue";

interface SessionType {
  terminal: Terminal;
  name: string;
  fitAddon: FitAddon;
}

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

export const useTerminalSessionStore = defineStore("terminalStore", () => {
  const currentFocusSession = ref<string | null>(null);
  const sessions = ref<Record<string, SessionType>>({});
  const isOpenTerminal = ref(false);
  const activeSessionLength = computed(
    () => Object.values(sessions.value).length
  );

  const folderStore = useFolderStore();

  const renderTeminal = (session: SessionType) => {
    const terminalElement = document.getElementById("terminal");

    if (!terminalElement) return;

    session.terminal.open(terminalElement);

    session?.fitAddon.fit();
  };

  const openTerminal = () => {
    isOpenTerminal.value = true;

    if (!activeSessionLength.value) {
      createSession();

      return;
    }

    const currentTerminal =
      sessions.value[currentFocusSession.value as keyof typeof sessions.value];

    renderTeminal(currentTerminal);
  };

  const closeTerminal = () => {
    isOpenTerminal.value = false;
  };

  const toggleTerminal = () => {
    if (isOpenTerminal.value) {
      closeTerminal();

      return;
    }

    openTerminal();
  };

  const closeSession = (id: string) => {
    const sessionToClose = sessions.value[id];

    sessionToClose.fitAddon.dispose();

    sessionToClose.terminal.dispose();

    const sessionsClone = { ...sessions.value };

    delete sessionsClone[id];

    sessions.value = sessionsClone;

    ipcRenderer.send("terminal.destroy", id);

    const listKeySessions = Object.keys(sessions.value);

    if (!listKeySessions.length) {
      closeTerminal();

      return;
    }

    if (id === currentFocusSession.value) {
      currentFocusSession.value = listKeySessions[listKeySessions.length - 1];
    }
  };

  const createSession = () => {
    const currentId = v4();

    ipcRenderer.send("terminal.createSessions", {
      path: folderStore.openFolder,
      id: currentId,
      shell,
    });

    const newTerminal = new Terminal({
      theme: terminalTheme,
    });

    ipcRenderer.on("terminal.incomingData" + currentId, (event, data) => {
      newTerminal.write(data);
    });

    newTerminal.onData((e) => {
      ipcRenderer.send("terminal.keystroke" + currentId, e);
    });

    newTerminal.onResize((size) => {
      ipcRenderer.send("terminal.resize" + currentId, size);
    });

    isOpenTerminal.value = true;

    currentFocusSession.value = currentId;

    const fitAddon = new FitAddon();

    const session = {
      name: shell,
      terminal: newTerminal,
      fitAddon,
    };

    renderTeminal(session);

    newTerminal.loadAddon(fitAddon);

    sessions.value = {
      ...sessions.value,
      [currentId]: session,
    };
  };

  const changeFocusTerminal = (id: string) => {
    currentFocusSession.value = id;
  };

  return {
    createSession,
    changeFocusTerminal,
    sessions,
    currentFocusSession,
    isOpenTerminal,
    openTerminal,
    closeTerminal,
    closeSession,
    toggleTerminal,
  };
});
