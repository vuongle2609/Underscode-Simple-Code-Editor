<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { usePathOpenStore } from "@/stores/pathOpen";

import ExplorerItemRecursive, { DirectoryStructType } from "./ExplorerItemRecursive.vue";

defineProps<DirectoryStructType & { index: number }>();

const { addEditorWithPath } = useEditorsOpenStore();
const pathOpenStore = usePathOpenStore();

const handleClickFile = ({
  path,
  name,
  fileClass,
}: Omit<DirectoryStructType, "isFile">) => {
  addEditorWithPath(path);
};

const handleClickFolder = ({
  index,
  path,
  name,
}: Omit<DirectoryStructType, "fileClass" | "isFile"> & {
  index: number;
}) => {
  pathOpenStore.openFolder(path);
};

const handleClickItem = ({
  fileClass,
  isFile,
  name,
  path,
  index,
}: DirectoryStructType & { index: number }) => {
  if (!isFile) {
    handleClickFolder({ index, name, path });
    return;
  }

  handleClickFile({ fileClass, name, path });
};
</script>

<template>
  <Button
    :full-width="true"
    :v-bind="$props"
    @click="
      handleClickItem({
        fileClass,
        isFile,
        name,
        path,
        index,
      })
    "
  >
    <i
      class="text-xs fa-light fa-chevron-right"
      v-if="!pathOpenStore.openFolderPath.includes(path)"
      :class="isFile && 'invisible'"
    ></i>

    <i
      class="text-xs fa-light fa-chevron-down"
      v-if="pathOpenStore.openFolderPath.includes(path)"
      :class="isFile && 'invisible'"
    ></i>

    <i class="icon" :class="fileClass" v-if="isFile"></i>
    <i class="fa-regular fa-file" v-if="isFile && !fileClass"></i>

    <span
      class="overflow-hidden text-sm font-light whitespace-nowrap text-ellipsis"
    >
      {{ name }}</span
    >
  </Button>

  <ExplorerItemRecursive
    v-if="!isFile && pathOpenStore.openFolderPath.includes(path)"
    :path
  />
</template>
