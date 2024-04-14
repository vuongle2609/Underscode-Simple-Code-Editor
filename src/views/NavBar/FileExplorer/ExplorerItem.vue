<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useContextMenuStore } from "@/stores/contextMenu";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import { usePathOpenStore } from "@/stores/pathOpen";
import { getAbsolutePath, getFileIconClass } from "@/utils/file";
import { onClickOutside, onKeyStroke, useFocus } from "@vueuse/core";
import fs from "fs";
import pathSys from "path";
import { computed, nextTick, ref } from "vue";
import { useToast } from "vue-toastification";
import ExplorerItemRecursive, {
  DirectoryStructType,
} from "./ExplorerItemRecursive.vue";

const isEditName = ref(false);

const toast = useToast();

const inputRenameRef = ref<HTMLInputElement>();
const inputNameValue = ref("");
const { focused } = useFocus(inputRenameRef);

const props = defineProps<DirectoryStructType & { index: number }>();

const contextMenuStore = useContextMenuStore();
const { addEditorWithPath } = useEditorsOpenStore();
const pathOpenStore = usePathOpenStore();

const editorsOpenStore = useEditorsOpenStore();
const folderStore = useFolderStore();

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

// rename section
const handleEditName = async () => {
  inputNameValue.value = props.name;
  isEditName.value = true;

  await nextTick();

  focused.value = true;
};

const handleCloseRename = () => {
  isEditName.value = false;
};

const handleRename = async () => {
  if (props.name === inputNameValue.value) {
    handleCloseRename();

    return;
  }

  try {
    pathSys.parse(props.path);

    const dirPath = pathSys.parse(props.path).dir;
    const newPath = pathSys.join(dirPath, inputNameValue.value.trim());

    fs.renameSync(props.path, newPath);

    editorsOpenStore.reloadEditor(props.path, newPath);
    folderStore.reloadFolder();

    handleCloseRename();
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};

onClickOutside(inputRenameRef, () => {
  handleCloseRename();
});

onKeyStroke(["Enter"], () => {
  if (isEditName.value) handleRename();
});

onKeyStroke(["Escape"], () => {
  handleCloseRename();
});
//end rename section

const handleContextMenu = ({
  isFile,
  name,
  path,
  fileClass,
}: DirectoryStructType) => {
  const fileMenus = [
    { label: "Open", action: () => handleClickFile({ fileClass, name, path }) },
    { label: "Copy", action: () => console.log(1) },
    { label: "Cut", action: () => console.log(1) },
    { label: "Rename", action: () => handleEditName() },
    { label: "Delete", action: () => console.log(1) },
  ];

  const folderMenus = [
    { label: "Create File", action: () => console.log(1) },
    { label: "Create Folder", action: () => console.log(1) },
    { label: "Copy", action: () => console.log(1) },
    { label: "Cut", action: () => console.log(1) },
    { label: "Rename", action: () => handleEditName() },
    { label: "Delete", action: () => console.log(1) },
  ];

  contextMenuStore.openContextMenu(isFile ? fileMenus : folderMenus);
};

const isOpen = computed(
  () => pathOpenStore.openFolderPath[getAbsolutePath(props.path)]
);

const fileClass = computed(() =>
  isEditName.value ? getFileIconClass(inputNameValue.value) : props.fileClass
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
    :data-active="path === pathOpenStore.currentFocusPathNav && !isEditName"
    :title="getAbsolutePath(path, true)"
    @contextmenu.prevent="handleContextMenu({ fileClass, isFile, name, path })"
  >
    <i class="text-xs fa-light fa-chevron-right" v-if="!isOpen && !isFile"></i>

    <i class="text-xs fa-light fa-chevron-down" v-if="isOpen && !isFile"></i>

    <i class="ml-4 icon" :class="fileClass" v-if="isFile"></i>
    <i class="ml-4 fa-regular fa-file" v-if="isFile && !fileClass"></i>

    <span
      v-if="!isEditName"
      class="block overflow-hidden text-xs font-light text-left grow break-word whitespace-nowrap text-ellipsis"
    >
      {{ name }}</span
    >

    <input
      @click.stop=""
      @blur=""
      v-model="inputNameValue"
      v-if="isEditName"
      ref="inputRenameRef"
      type="text"
      class="w-full py-1 pl-2 text-xs text-sm rounded-md outline-none bg-bgSecondary"
    />
  </Button>

  <ExplorerItemRecursive v-if="!isFile && isOpen" :path />
</template>
