<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { getClassWithColor } from "file-icons-js";
import fs from "fs";
import { ref, toRef, watch } from "vue";

const props = defineProps<{
  path: string;
}>();

const path = toRef(props, "path");

interface DirectoryStructType {
  name: string;
  isFile: boolean;
  fileClass: string;
  isOpen: boolean;
  path: string;
}

const directoryStruct = ref<DirectoryStructType[]>([]);

const getFileDetail = async (path: string) => {
  return (await fs.promises.readdir(path, { withFileTypes: true }))
    .sort((a, b) => (a.isFile() ? 1 : 0) - (b.isFile() ? 1 : 0))
    .map((file) => {
      return {
        name: file.name,
        isFile: file.isFile(),
        fileClass: getClassWithColor(file.name) || getClassWithColor("foo.txt"),
        isOpen: false,
        path: path + "/" + file.name,
      };
    });
};
const renderFileStruct = async (folderPath?: string) => {
  if (!folderPath) return;

  const directoryDetail = await getFileDetail(folderPath);

  directoryStruct.value = directoryDetail;
};

const { addEditorWithPath } = useEditorsOpenStore();

const handleClickFile = ({
  path,
  name,
  fileClass,
}: Omit<DirectoryStructType, "isOpen" | "isFile">) => {
  addEditorWithPath(path);
};

const handleClickFolder = ({
  index,
  isOpen,
}: {
  index: number;
  isOpen: boolean;
}) => {
  directoryStruct.value[index].isOpen = !isOpen;
};

const handleClickItem = ({
  fileClass,
  isFile,
  name,
  path,
  index,
  isOpen,
}: DirectoryStructType & { index: number }) => {
  if (!isFile) {
    handleClickFolder({ index, isOpen });
    return;
  }

  handleClickFile({ fileClass, name, path });
};

watch(path, () => {
  renderFileStruct(path.value);
});

renderFileStruct(path.value);
</script>

<template>
  <div class="pl-2">
    <template
      v-for="(
        { fileClass, isFile, isOpen, name, path }, index
      ) in directoryStruct"
    >
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
            isOpen,
          })
        "
      >
        <i
          class="text-xs fa-light fa-chevron-right"
          v-if="!isOpen"
          :class="isFile && 'invisible'"
        ></i>

        <i
          class="text-xs fa-light fa-chevron-down"
          v-if="isOpen"
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

      <ExplorerItem v-if="!isFile && isOpen" :path />
    </template>
  </div>
</template>
