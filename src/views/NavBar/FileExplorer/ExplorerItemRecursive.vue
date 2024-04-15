<script setup lang="ts">
import { getFileIconClass } from "@/utils/file";
const fs = require("fs-extra");
import sysPath from "path";
import { ref, toRef, watch } from "vue";
import ExplorerItem from "./ExplorerItem.vue";

const props = defineProps<{
  path: string;
}>();

const path = toRef(props, "path");

export interface DirectoryStructType {
  name: string;
  isFile: boolean;
  fileClass: string;
  path: string;
}

const directoryStruct = ref<DirectoryStructType[]>([]);

const getFileDetail = async (path: string) => {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .sort((a: { isFile: () => any; }, b: { isFile: () => any; }) => (a.isFile() ? 1 : 0) - (b.isFile() ? 1 : 0))
    .map((file: { name: string; isFile: () => any; }) => {
      return {
        name: file.name,
        isFile: file.isFile(),
        fileClass: getFileIconClass(file.name),
        isOpen: false,
        path: sysPath.join(path, file.name),
      };
    });
};

const renderFileStruct = async (folderPath?: string) => {
  if (!folderPath) return;

  const directoryDetail = await getFileDetail(folderPath);

  directoryStruct.value = directoryDetail;
};

watch(path, () => {
  renderFileStruct(path.value);
});

renderFileStruct(path.value);
</script>

<template>
  <div class="w-full pl-2 overflow-hidden">
    <ExplorerItem
      v-for="({ fileClass, isFile, name, path }, index) in directoryStruct"
      :fileClass
      :isFile
      :name
      :path
      :index
    />
  </div>
</template>
