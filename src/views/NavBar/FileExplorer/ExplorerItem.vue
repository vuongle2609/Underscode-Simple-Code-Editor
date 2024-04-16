<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useClipboardStore } from "@/stores/clipboard";
import { useContextMenuStore } from "@/stores/contextMenu";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import { usePathOpenStore } from "@/stores/pathOpen";
import { getAbsolutePath, getFileIconClass } from "@/utils/file";
import {
  onClickOutside,
  onKeyStroke,
  useFocus,
  useWindowFocus,
} from "@vueuse/core";
import pathSys from "path";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import ExplorerItemRecursive, {
  DirectoryStructType,
} from "./ExplorerItemRecursive.vue";
const fs = require("fs-extra");

const isEditName = ref(false);

const windowFocused = useWindowFocus();

const toast = useToast();

const showCreateDir = ref(false);
const isCreateFile = ref(false);
const inputCreateDirRef = ref<HTMLInputElement>();
const { focused: focusedCreateDir } = useFocus(inputCreateDirRef);

const inputRenameRef = ref<HTMLInputElement>();
const inputNameValue = ref("");
const { focused: focusedRename } = useFocus(inputRenameRef);

const props = defineProps<DirectoryStructType & { index: number }>();

const contextMenuStore = useContextMenuStore();

const { addEditorWithPath } = useEditorsOpenStore();

const pathOpenStore = usePathOpenStore();

const editorsOpenStore = useEditorsOpenStore();

const folderStore = useFolderStore();

const clipboardStore = useClipboardStore();
const { cutClipboard, copyClipboard, clipboard } = storeToRefs(clipboardStore);

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

const handleClickCreateDir = async (isFile: boolean) => {
  showCreateDir.value = true;
  isCreateFile.value = isFile;

  await nextTick();

  focusedCreateDir.value = true;
};

const handleCreateFile = async () => {
  if (inputCreateDirRef.value && inputCreateDirRef.value?.value) {
    try {
      const fileName = inputCreateDirRef.value.value;
      const newPath = pathSys.join(props.path, fileName);

      const fd = fs.openSync(newPath, "wx");

      fs.closeSync(fd);

      handleCloseCreateDir();

      addEditorWithPath(newPath);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  }
};

const handleCreateFolder = async () => {
  if (inputCreateDirRef.value && inputCreateDirRef.value?.value) {
    try {
      const folderName = inputCreateDirRef.value.value;
      const newPath = pathSys.join(props.path, folderName);

      fs.mkdirSync(newPath, { recursive: true });

      handleCloseCreateDir();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
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

const handleEditName = async () => {
  inputNameValue.value = props.name;
  isEditName.value = true;

  await nextTick();

  focusedRename.value = true;
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

    handleCloseRename();
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};

const handleDelete = async (isFile: boolean) => {
  try {
    fs.removeSync(props.path);
  } catch (err) {
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};

const handleCopy = async (isFile: boolean) => {
  clipboardStore.handleCopy(props.path, isFile);
};

const handleCut = async (isFile: boolean) => {
  clipboardStore.handleCut(props.path, isFile);
};

const handlePaste = async () => {
  try {
    if (!clipboard.value) return;

    let dirMoveName = pathSys.parse(clipboard.value.path).base;

    let dirDist = pathSys.join(props.path, dirMoveName);

    while (fs.pathExistsSync(dirDist)) {
      dirDist += "Copy";
    }

    if (clipboard.value.isCut) {
      fs.moveSync(clipboard.value.path, dirDist, {
        overwrite: true,
      });
    }

    if (!clipboard.value.isCut) {
      fs.copySync(clipboard.value.path, dirDist);
    }

    clipboardStore.handleClearClipboardPath();
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

  if (showCreateDir && isCreateFile.value) handleCreateFile();

  if (showCreateDir && !isCreateFile.value) handleCreateFolder();
});

onKeyStroke(["Escape"], () => {
  handleCloseRename();

  handleCloseCreateDir();
});

watch(windowFocused, () => {
  if (!windowFocused.value) {
    handleCloseCreateDir();
    handleCloseRename();
  }
});

const handleContextMenu = ({
  isFile,
  name,
  path,
  fileClass,
}: DirectoryStructType) => {
  const fileMenus = [
    { label: "Open", action: () => handleClickFile({ fileClass, name, path }) },
    { label: "Copy", action: () => handleCopy(true) },
    { label: "Cut", action: () => handleCut(true) },
    { label: "Rename", action: () => handleEditName() },
    { label: "Delete", action: () => handleDelete(true) },
  ];

  const folderMenus = [
    { label: "Create File", action: () => handleClickCreateDir(true) },
    { label: "Create Folder", action: () => handleClickCreateDir(false) },
    { label: "Copy", action: () => handleCopy(false) },
    { label: "Cut", action: () => handleCut(false) },
    ...(clipboard.value
      ? [{ label: "Paste", action: () => handlePaste() }]
      : []),
    { label: "Rename", action: () => handleEditName() },
    { label: "Delete", action: () => handleDelete(false) },
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
    @contextmenu.stop.prevent="
      handleContextMenu({ fileClass, isFile, name, path })
    "
  >
    <i class="text-xs fa-light fa-chevron-right" v-if="!isOpen && !isFile"></i>

    <i class="text-xs fa-light fa-chevron-down" v-if="isOpen && !isFile"></i>

    <i class="ml-4 icon" :class="fileClass" v-if="isFile"></i>
    <i class="ml-4 fa-regular fa-file" v-if="isFile && !fileClass"></i>

    <span
      v-if="!isEditName"
      class="block overflow-hidden text-xs font-light text-left grow break-word whitespace-nowrap text-ellipsis"
      :class="cutClipboard?.path === path ? 'text-gray-500' : ''"
    >
      {{ name }}</span
    >

    <input
      @click.stop=""
      v-model="inputNameValue"
      v-if="isEditName"
      ref="inputRenameRef"
      type="text"
      class="w-full py-1 pl-2 text-xs rounded-md outline-none bg-bgSecondary"
    />
  </Button>

  <div class="flex items-center gap-2 px-2 py-1 pl-4" v-if="showCreateDir">
    <i
      class="fa-light"
      :class="isCreateFile ? 'fa-bars-sort' : 'fa-folder'"
    ></i>

    <input
      ref="inputCreateDirRef"
      type="text"
      class="w-full py-1 pl-2 text-xs rounded-md outline-none bg-bgSecondary"
    />
  </div>

  <ExplorerItemRecursive v-if="!isFile && isOpen" :path />
</template>
