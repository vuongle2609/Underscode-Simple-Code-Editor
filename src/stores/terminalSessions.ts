import { terminalTheme } from "@/config/theme";
import { useFolderStore } from "@/stores/folder";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { ipcRenderer } from "electron";
import { defineStore } from "pinia";
import { v4 } from "uuid";
import { computed, ref } from "vue";

export const useTerminalSessionStore = defineStore("terminalStore", () => {
  const currentFocusSession = ref<string | null>(null);
  const sessions = ref<
    Record<
      string,
      {
        terminal: Terminal;
        name: string;
      }
    >
  >({});
  const isOpenTerminal = ref(false);
  const activeSessionLength = computed(
    () => Object.values(sessions.value).length
  );

  const folderStore = useFolderStore();

  const renderTeminal = (terminal: Terminal) => {
    const terminalElement = document.getElementById("terminal");

    if (!terminalElement) return;

    terminal.open(terminalElement);
  };

  const openTerminal = () => {
    isOpenTerminal.value = true;

    if (!activeSessionLength.value) {
      createSession();

      return;
    }

    const currentTerminal =
      sessions.value[currentFocusSession.value as keyof typeof sessions.value];

    renderTeminal(currentTerminal.terminal);
  };

  const closeTerminal = () => {
    isOpenTerminal.value = false;
  };

  const createSession = () => {
    const currentId = v4();

    ipcRenderer.send("terminal.createSessions", {
      path: folderStore.openFolder,
      id: currentId,
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

    isOpenTerminal.value = true;

    renderTeminal(newTerminal);

    currentFocusSession.value = currentId;

    sessions.value = {
      ...sessions.value,
      [currentId]: {
        name: "Terminal " + (Object.keys(sessions.value).length + 1),
        terminal: newTerminal,
      },
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
  };
});
