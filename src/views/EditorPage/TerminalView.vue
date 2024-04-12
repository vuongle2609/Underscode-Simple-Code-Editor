<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { terminalTheme } from "@/config/theme";
import { useFolderStore } from "@/stores/folder";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { ipcRenderer } from "electron";
import { v4 } from "uuid";
import { ref, watch } from "vue";

const folderStore = useFolderStore();

const terminalRef = ref();

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

const createSession = () => {
  const currentId = v4();

  ipcRenderer.send("terminal.createSessions", {
    path: folderStore.openFolder,
    id: currentId,
  });

  const newTerminal = new Terminal({
    theme: terminalTheme,
  });

  newTerminal.write("Hello from \x1B[1;3;31mmemay\x1B[0m $ ");

  ipcRenderer.on("terminal.incomingData" + currentId, (event, data) => {
    newTerminal.write(data);
  });

  newTerminal.onData((e) => {
    ipcRenderer.send("terminal.keystroke" + currentId, e);
  });

  newTerminal.open(terminalRef.value);

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

watch(currentFocusSession, () => {
  Object.values(sessions.value).forEach((item) => {
    const element = item.terminal.element;

    if (element) element.style.display = "none";
  });

  if (currentFocusSession.value) {
    const currentTerminal = sessions.value[currentFocusSession.value].terminal;

    currentTerminal.open(terminalRef.value);

    const element = currentTerminal.element;

    if (element) element.style.display = "block";
  }
});
</script>

<template>
  <div class="px-4 py-2 mt-auto border-t-2 border-solid border-bgButton">
    <div class="flex items-center justify-between text-white">
      <div>Terminal</div>

      <div class="text-white">
        <Button variant="filled" @click="createSession"
          >New <i class="text-white fa-solid fa-plus"></i
        ></Button>
      </div>
    </div>

    <div class="flex pt-2">
      <div class="h-full grow">
        <div ref="terminalRef" id="terminal"></div>
      </div>

      <div
        class="w-[200px] p-2 overflow-hidden text-sm text-white break-all rounded-md hideScrollbar bg-bgMain text-ellipsis whitespace-nowrap"
      >
        <template v-for="({ name }, id) in sessions">
          <Button
            :full-width="true"
            :data-active="currentFocusSession === id"
            @click="changeFocusTerminal(id)"
            ><span
              class="overflow-hidden text-sm text-left text-white break-all grow text-ellipsis whitespace-nowrap"
            >
              <i class="fa-solid fa-terminal"></i> {{ name }}
            </span></Button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.terminal.xterm {
  padding: 10px;
}

.xterm-viewport {
  overflow: auto;
  /* transition: all 0.4s ease-in-out; */
}

.xterm-viewport::-webkit-scrollbar {
  width: 0px;
}

.xterm .xterm-viewport:hover::-webkit-scrollbar {
  width: 10px;
}

.xterm-viewport::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
.xterm-viewport::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.xterm-viewport::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
