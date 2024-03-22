<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import ExplorerItem from "./ExplorerItem.vue";

const folderStore = useFolderStore();

const actionButtons = [
  {
    title: "Search Files",
    icon: "fa-magnifying-glass",
    click: () => console.log(1),
  },
  {
    title: "Create File",
    icon: "fa-file-plus",
    click: () => console.log(1),
  },
  {
    title: "Create Folder",
    icon: "fa-folder-plus",
    click: () => console.log(1),
  },
  {
    title: "Refresh Explorer",
    icon: "fa-rotate-right",
    click: () => folderStore.reloadFolder(),
  },
];
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-1 bg-bgMain">
      <span class="text-sm font-light">Explorer</span>

      <div class="flex">
        <template v-for="{ icon, title, click } in actionButtons">
          <IconButton :title @click="click">
            <i :class="['fa-solid', icon]"></i>
          </IconButton>
        </template>
      </div>
    </div>

    <perfect-scrollbar class="py-2 pr-4 overflow-x-hidden overflow-y-auto grow">
      <ExplorerItem
        v-if="folderStore.openFolder"
        :isOpen="true"
        :path="folderStore.openFolder"
      />
    </perfect-scrollbar>

    <div class="flex items-center justify-between px-2 py-2 bg-bgSecondary">
      <Button>
        <i class="fa-light fa-code-branch"></i>

        <span class="text-sm">Develop</span>
      </Button>

      <div class="relative flex items-center gap-4 top-[2px]">
        <span
          class="flex items-center gap-1 text-xs font-semibold text-red-400"
        >
          <i class="fa-solid fa-circle-exclamation"></i>
          1
        </span>

        <span
          class="flex items-center gap-1 text-xs font-semibold text-yellow-200"
        >
          <i class="fa-solid fa-triangle-exclamation"></i> 2
        </span>
      </div>
    </div>
  </div>
</template>
