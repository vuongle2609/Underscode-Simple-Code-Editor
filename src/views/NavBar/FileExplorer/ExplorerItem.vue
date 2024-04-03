<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { usePathOpenStore } from "@/stores/pathOpen";

import ExplorerItemRecursive, {
  DirectoryStructType,
} from "./ExplorerItemRecursive.vue";
import { computed } from "vue";
import { getAbsolutePath } from "@/utils/file";

const props = defineProps<DirectoryStructType & { index: number }>();

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
  pathOpenStore.toggleFolder(getAbsolutePath(path));
};

const handleClickItem = ({
  fileClass,
  isFile,
  name,
  path,
  index,
}: DirectoryStructType & { index: number }) => {
  pathOpenStore.$patch({ currentFocusPathNav: path });

  if (!isFile) {
    handleClickFolder({ index, name, path });
    return;
  }

  handleClickFile({ fileClass, name, path });
};

const isOpen = computed(
  () => pathOpenStore.openFolderPath[getAbsolutePath(props.path)]
);
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
    :data-active="path === pathOpenStore.currentFocusPathNav"
    :title="name"
  >
    <i class="text-xs fa-light fa-chevron-right" v-if="!isOpen && !isFile"></i>

    <i class="text-xs fa-light fa-chevron-down" v-if="isOpen && !isFile"></i>

    <i class="ml-4 icon" :class="fileClass" v-if="isFile"></i>
    <i class="ml-4 fa-regular fa-file" v-if="isFile && !fileClass"></i>

    <span
      class="block overflow-hidden grow text-left break-word text-sm font-light whitespace-nowrap text-ellipsis"
    >
      {{ name }}</span
    >
  </Button>

  <ExplorerItemRecursive v-if="!isFile && isOpen" :path />
</template>
