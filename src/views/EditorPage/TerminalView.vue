<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useTerminalSessionStore } from "@/stores/terminalSessions";
import { useResizeObserver } from "@vueuse/core";
import "@xterm/xterm/css/xterm.css";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

const terminalSessionsStore = useTerminalSessionStore();
const { currentFocusSession, sessions, isOpenTerminal } = storeToRefs(
  terminalSessionsStore
);

const isFullView = ref(false);

const terminalRef = ref();

watch(currentFocusSession, () => {
  Object.values(sessions.value).forEach((item) => {
    const element = item.terminal.element;

    if (element) element.style.display = "none";
  });

  if (currentFocusSession.value) {
    const currentSession = sessions.value[currentFocusSession.value];
    const currentTerminal = currentSession.terminal;

    currentTerminal.open(terminalRef.value);

    const element = currentTerminal.element;

    if (element) element.style.display = "block";

    currentSession?.fitAddon.fit();
  }
});

useResizeObserver(terminalRef, () => {
  sessions.value[
    currentFocusSession.value as keyof typeof sessions.value
  ]?.fitAddon.fit();
});
</script>

<template>
  <div
    class="absolute z-20 w-full bg-bgSecondary"
    :class="[
      isOpenTerminal ? 'bottom-0' : 'top-full',
      isFullView ? 'h-full' : 'h-[300px]',
    ]"
  >
    <div
      class="flex flex-col w-full h-full p-2 pb-0 border-t-2 border-solid border-bgButton shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] min-w-[100px]"
    >
      <div class="flex overflow-hidden grow">
        <div ref="terminalRef" id="terminal" class="h-full grow"></div>

        <div class="pb-2">
          <div
            class="w-full max-w-[200px] p-2 overflow-hidden text-sm text-white break-all rounded-md hideScrollbar bg-bgMain text-ellipsis whitespace-nowrap flex flex-col gap-1 h-full"
          >
            <div class="flex text-white">
              <IconButton
                size="sm"
                title="Create Terminal"
                @click="terminalSessionsStore.createSession()"
                ><i class="text-white fa-solid fa-plus"></i
              ></IconButton>

              <IconButton
                size="sm"
                title="Full view"
                @click="isFullView = !isFullView"
                ><i
                  class="text-white fa-solid"
                  :class="isFullView ? 'fa-chevron-down' : 'fa-chevron-up'"
                ></i
              ></IconButton>

              <span class="ml-auto">
                <IconButton
                  size="sm"
                  title="Hide Terminal"
                  @click="terminalSessionsStore.closeTerminal()"
                  ><i class="text-white fa-solid fa-xmark"></i
                ></IconButton>
              </span>
            </div>

            <div class="flex flex-col gap-1 overflow-auto sideBar">
              <template v-for="({ name }, id) in sessions">
                <div class="flex gap-1">
                  <Button
                    :full-width="true"
                    :data-active="currentFocusSession === id"
                    @click="terminalSessionsStore.changeFocusTerminal(id)"
                    ><span
                      class="overflow-hidden text-xs text-left text-white break-all grow text-ellipsis whitespace-nowrap"
                    >
                      <i class="text-[10px] fa-solid fa-terminal"></i>
                      {{ name }}
                    </span>
                  </Button>

                  <IconButton
                    title="Kill session"
                    size="sm"
                    @click="terminalSessionsStore.closeSession(id)"
                    ><i class="text-red-500 fa-solid fa-trash"></i
                  ></IconButton>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.terminal.xterm {
  height: 100%;
  padding: 2px;
  overflow: hidden;
}
</style>
