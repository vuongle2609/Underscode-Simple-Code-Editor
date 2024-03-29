<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import IconButton from "@/components/general/IconButton.vue";
import { useFolderStore } from "@/stores/folder";
import ExplorerItem from "@/components/bussiness/ExplorerItem.vue";
import { ref, nextTick, watch } from "vue";
import {
  useFocus,
  onKeyStroke,
  onClickOutside,
  useWindowFocus,
} from "@vueuse/core";
import fs from "fs";
import path from "path";
import { useToast } from "vue-toastification";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { getClassWithColor } from "file-icons-js";

const toast = useToast();

const { addEditor } = useEditorsOpenStore();

const folderStore = useFolderStore();

const inputCreateDirRef = ref<HTMLInputElement>();
const { focused } = useFocus(inputCreateDirRef);

const windowFocused = useWindowFocus();

const showCreateDir = ref(false);
const isCreateFile = ref(false);

const handleClickCreateDir = async (isFile: boolean) => {
  showCreateDir.value = true;
  isCreateFile.value = isFile;

  await nextTick();

  focused.value = true;
};

const handleCreateFile = async () => {
  if (
    inputCreateDirRef.value &&
    inputCreateDirRef.value?.value &&
    folderStore.openFolder
  ) {
    try {
      const fileName = inputCreateDirRef.value.value;
      const newPath = path.join(folderStore.openFolder, fileName);

      const fd = fs.openSync(newPath, "wx");

      fs.closeSync(fd);

      folderStore.reloadFolder();

      handleCloseCreateDir();

      addEditor({
        path: newPath,
        name: fileName,
        fileClass: getClassWithColor(fileName) || getClassWithColor("foo.txt"),
      });
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "EEXIST") {
        toast.error("File already exists");
      } else {
        toast.error("Error creating file");
      }
    }
  }
};

const handleCreateFolder = async () => {
  if (
    inputCreateDirRef.value &&
    inputCreateDirRef.value?.value &&
    folderStore.openFolder
  ) {
    try {
      const folderName = inputCreateDirRef.value.value;
      const newPath = path.join(folderStore.openFolder, folderName);

      fs.mkdirSync(newPath, { recursive: true });

      folderStore.reloadFolder();

      handleCloseCreateDir();
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "EEXIST") {
        toast.error("File already exists");
      } else {
        toast.error("Error creating file");
      }
    }
  }
};

const handleCloseCreateDir = () => {
  if (inputCreateDirRef.value) {
    showCreateDir.value = false;
    inputCreateDirRef.value.value = "";
  }
};

onClickOutside(inputCreateDirRef, () => {
  handleCloseCreateDir();
});

onKeyStroke(["Enter"], () => {
  if (showCreateDir && isCreateFile.value) handleCreateFile();

  if (showCreateDir && !isCreateFile.value) handleCreateFolder();
});

onKeyStroke(["Escape"], () => {
  if (showCreateDir && inputCreateDirRef.value) {
    showCreateDir.value = false;
    inputCreateDirRef.value.value = "";
  }
});

watch(windowFocused, () => {
  if (!windowFocused.value) {
    handleCloseCreateDir();
  }
});

const actionButtons = [
  {
    title: "Search Files",
    icon: "fa-magnifying-glass",
    click: () => console.log(1),
  },
  {
    title: "Create File",
    icon: "fa-file-plus",
    click: () => handleClickCreateDir(true),
  },
  {
    title: "Create Folder",
    icon: "fa-folder-plus",
    click: () => handleClickCreateDir(false),
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
      <div class="flex items-center gap-2 px-2 py-1 pl-4" v-if="showCreateDir">
        <i
          class="fa-light"
          :class="isCreateFile ? 'fa-bars-sort' : 'fa-folder'"
        ></i>

        <input
          ref="inputCreateDirRef"
          type="text"
          class="px-2 py-1 text-sm rounded-md outline-none bg-bgSecondary"
        />
      </div>

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
