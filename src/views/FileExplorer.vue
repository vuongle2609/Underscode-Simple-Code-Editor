<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import {
  IconAlertTriangle,
  IconExclamationCircle,
  IconFilePlus,
  IconFolderPlus,
  IconGitBranch,
  IconReload,
  IconSearch,
} from "@tabler/icons-vue";
import { getClass } from "file-icons-js";
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
    .readdirSync(path, { withFileTypes: true, recursive: true })
    .sort((a, b) => (a.isFile() ? 1 : 0) - (b.isFile() ? 1 : 0))
    .map((file) => {
      return {
        name: file.name,
        isFile: file.isFile(),
        fileClass: getClass(file.name),
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
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-4 py-2">
      <span class="text-lg">Explorer</span>

      <div class="flex gap-2">
        <IconButton title="Search Files">
          <IconSearch size="1.4rem" stroke="1.5" />
        </IconButton>

        <IconButton title="Create File">
          <IconFilePlus size="1.4rem" stroke="1.5" />
        </IconButton>

        <IconButton title="Create Folder">
          <IconFolderPlus size="1.4rem" stroke="1.5" />
        </IconButton>

        <IconButton
          title="Refresh Explorer"
          @click="renderFileStruct(folderStore.openFolder)"
        >
          <IconReload size="1.4rem" stroke="1.5" />
        </IconButton>
      </div>
    </div>

    <div class="px-4 py-2 overflow-auto grow">
      <template
        v-for="(
          { fileClass, isFile, isOpen, name, path }, index
        ) in directoryStruct"
      >
        <ExplorerItem
          @click="handleClickItem(path, isFile)"
          :name
          :isFile
          :fileClass
          :isOpen
          :path
        />
      </template>
    </div>

    <div class="flex items-center justify-between px-2">
      <Button>
        <IconGitBranch size="1.4rem" stroke="1.5" />

        <span class="text-sm">Develop</span>
      </Button>

      <div class="flex gap-4">
        <span
          class="flex items-center gap-1 text-xs font-semibold text-red-400"
        >
          <IconExclamationCircle size="1.1rem" stroke="2" /> 1
        </span>

        <span
          class="flex items-center gap-1 text-xs font-semibold text-yellow-200"
        >
          <IconAlertTriangle size="1.1rem" stroke="2" /> 2
        </span>
      </div>
    </div>
  </div>
</template>
