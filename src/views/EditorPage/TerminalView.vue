<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useTerminalSessionStore } from "@/stores/terminalSessions";
import "@xterm/xterm/css/xterm.css";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const terminalSessionsStore = useTerminalSessionStore();
const { currentFocusSession, sessions, isOpenTerminal } = storeToRefs(
  terminalSessionsStore
);

const terminalRef = ref();

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
  <div
    class="absolute w-full"
    :class="isOpenTerminal ? 'bottom-0' : 'top-full'"
  >
    <vue-resizable :active="['t']">
      <div
        class="w-full h-full border-t-2 border-solid border-bgButton px-4 py-2"
      >
        <div class="flex items-center justify-between text-white">
          <div>Terminal</div>

          <div class="text-white flex gap-2">
            <Button
              variant="filled"
              @click="terminalSessionsStore.createSession()"
              >New <i class="text-white fa-thin fa-plus"></i
            ></Button>

            <IconButton
              variant="filled"
              @click="terminalSessionsStore.closeTerminal()"
              ><i class="text-white fa-thin fa-xmark"></i
            ></IconButton>
          </div>
        </div>

        <div class="flex pt-2 h-full">
          <div class="h-full grow">
            <div ref="terminalRef" id="terminal" class="h-full"></div>
          </div>

          <div
            class="w-[200px] p-2 overflow-hidden text-sm text-white break-all rounded-md hideScrollbar bg-bgMain text-ellipsis whitespace-nowrap flex flex-col gap-1"
          >
            <template v-for="({ name }, id) in sessions">
              <Button
                :full-width="true"
                :data-active="currentFocusSession === id"
                @click="terminalSessionsStore.changeFocusTerminal(id)"
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
    </vue-resizable>
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
