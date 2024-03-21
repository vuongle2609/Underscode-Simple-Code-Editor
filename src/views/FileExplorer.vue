<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import { getClassWithColor } from "file-icons-js";
import fs from "fs";
import { shallowRef } from "vue";
import ExplorerItem from "./ExplorerItem.vue";

const directoryStruct = shallowRef<
  {
    name: string;
    isFile: boolean;
    fileClass: string;
    isOpen: boolean;
    path: string;
  }[]
>([]);

const folderStore = useFolderStore();

const getFileDetail = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .sort((a, b) => (a.isFile() ? 1 : 0) - (b.isFile() ? 1 : 0))
    .map((file) => {
      return {
        name: file.name,
        isFile: file.isFile(),
        fileClass: getClassWithColor(file.name),
        isOpen: false,
        path: path + "/" + file.name,
      };
    });

const renderFileStruct = async (folderPath: string | null) => {
  if (!folderPath) return;

  const directoryDetail = getFileDetail(folderPath);

  directoryStruct.value = directoryDetail;
};

const handleClickItem = (path: string, isFile: boolean) => {
  if (isFile) {
    folderStore.changeOpenFile(path);

    return;
  }

  const directoryDetail = getFileDetail(path);

  console.log(directoryDetail);
};

renderFileStruct(folderStore.openFolder);

const actionButtons = [
  {
    title: "Search Files",
    icon: "fa-magnifying-glass",
    click: () => renderFileStruct(folderStore.openFolder),
  },
  {
    title: "Create File",
    icon: "fa-file-plus",
    click: () => renderFileStruct(folderStore.openFolder),
  },
  {
    title: "Create Folder",
    icon: "fa-folder-plus",
    click: () => renderFileStruct(folderStore.openFolder),
  },
  {
    title: "Refresh Explorer",
    icon: "fa-rotate-right",
    click: () => renderFileStruct(folderStore.openFolder),
  },
];
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-1 bg-bgSecondary">
      <span class="text-sm font-light">Explorer</span>

      <div class="flex">
        <template v-for="{ icon, title, click } in actionButtons">
          <IconButton :title @click="click">
            <i :class="['fa-solid', icon]"></i>
          </IconButton>
        </template>
      </div>
    </div>

    <perfect-scrollbar class="px-2 py-2 overflow-auto grow">
      <template
        v-for="{ fileClass, isFile, isOpen, name, path } in directoryStruct"
      >
        <ExplorerItem :name :isFile :fileClass :isOpen :path /> </template
    ></perfect-scrollbar>

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
