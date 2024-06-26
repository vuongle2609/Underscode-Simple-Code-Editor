<script setup lang="ts">
import { ListBox } from "@/components/general/ListBox";
import Popover from "@/components/general/Popover.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import { ipcRenderer, shell } from "electron";
import { computed, nextTick } from "vue";
import TabBarItem from "../TabBarItem.vue";
import Item from "./Item.vue";
import { useTerminalSessionStore } from "@/stores/terminalSessions";
import { Tab, useTabOpen } from "@/stores/tabOpen";

export type OptionType = {
  label: string;
  icon?: string;
  items?: OptionType[];
  action?: () => void;
  disabled?: boolean;
};

const tabOpen = useTabOpen();
const folderStore = useFolderStore();
const editorsOpenStore = useEditorsOpenStore();
const terminalStore = useTerminalSessionStore();

const options = computed<OptionType[]>(() => [
  {
    label: "File",
    icon: "fa-file",
    items: [
      { label: "Open Folder", action: folderStore.chooseFolder },
      { label: "Close Folder", action: folderStore.closeFolder },

      {
        label: "Close All Editor (Save)",
        action: async () => {
          editorsOpenStore.handleSaveAllEditor();

          await nextTick();

          editorsOpenStore.resetEditor();
        },
      },
      {
        label: "Close All Editor (Not Save)",
        action: editorsOpenStore.resetEditor,
      },

      {
        label: "New Window",
        action: () =>
          ipcRenderer.send("asynchronous-message", "createNewWindow"),
      },
      {
        label: "Close Window",
        action: () =>
          ipcRenderer.send("asynchronous-message", "quitCurrentWindow"),
      },
    ],
  },
  {
    label: "View",
    icon: "fa-sidebar",
    items: [
      { label: "Folder", action: () => tabOpen.changeOpenTab(Tab.explorer) },
      { label: "Search", action: () => tabOpen.changeOpenTab(Tab.search) },
      { label: "Terminal", action: () => terminalStore.openTerminal() },
    ],
  },
  {
    label: "Edit",
    icon: "fa-file-pen",
    items: [
      { label: "Save", action: editorsOpenStore.handleSaveEditor },
      { label: "Save All", action: editorsOpenStore.handleSaveAllEditor },
      { label: "Search", action: editorsOpenStore.toggleSearch },
    ],
    disabled: !editorsOpenStore.focusEditor,
  },
  {
    label: "About",
    icon: "fa-memo-circle-info",
    items: [
      {
        label: "vuongle2609 (Creator)",
        action: () => shell.openExternal("https://github.com/vuongle2609"),
      },
      {
        label: "Github (Source Code)",
        action: () =>
          shell.openExternal("https://github.com/vuongle2609/Underscode-Simple-Code-Editor"),
      },
    ],
  },
]);
</script>

<template>
  <Popover v-slot="{ toggle, dropDownClass, close }">
    <TabBarItem @click="toggle()" title="Options">
      <i class="fa-solid fa-bars"></i>
    </TabBarItem>

    <div :class="dropDownClass" class="min-w-[200px]">
      <ListBox>
        <template v-for="{ label, icon, items, disabled } in options">
          <Item
            :label
            v-if="!disabled"
            :icon
            :options="items || []"
            :closePopover="close"
          ></Item
        ></template>
      </ListBox>
    </div>
  </Popover>
</template>
