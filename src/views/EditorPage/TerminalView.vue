<script setup lang="ts">
import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { onMounted, ref } from "vue";
import { ipcMain, ipcRenderer } from "electron";
const terminalRef = ref();

onMounted(() => {
  const term = new Terminal();
  term.open(terminalRef.value);
  //   term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
  //   term.onData((e) => term.write(e));

  ipcRenderer.on("terminal.incomingData", (event, data) => {
    term.write(data);
  });

  term.onData((e) => {
    ipcRenderer.send("terminal.keystroke", e);
  });
});
</script>

<template>
  <div class="px-4 py-2 mt-auto">
    <div ref="terminalRef" id="terminal"></div>
  </div>
</template>