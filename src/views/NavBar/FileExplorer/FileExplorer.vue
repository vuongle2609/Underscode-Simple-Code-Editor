<script setup lang="ts">
import IconButton from "@/components/general/IconButton.vue";
import { emitter } from "@/main";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { useFolderStore } from "@/stores/folder";
import { useTerminalSessionStore } from "@/stores/terminalSessions";
import {
  onClickOutside,
  onKeyStroke,
  useFocus,
  useWindowFocus,
} from "@vueuse/core";
const fs = require("fs-extra");
import path from "path";
import { nextTick, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import ExplorerItemRecursive from "./ExplorerItemRecursive.vue";
import { useClipboardStore } from "@/stores/clipboard";
import { storeToRefs } from "pinia";
import { useContextMenuStore } from "@/stores/contextMenu";

const toast = useToast();

const { toggleTerminal } = useTerminalSessionStore();
const { addEditorWithPath } = useEditorsOpenStore();

const folderStore = useFolderStore();

const clipboardStore = useClipboardStore();
const { cutClipboard, copyClipboard, clipboard } = storeToRefs(clipboardStore);

const contextMenuStore = useContextMenuStore();

const componentKey = ref("explorerBar");
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

      handleCloseCreateDir();

      addEditorWithPath(newPath);
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
    handleCloseCreateDir();
  }
});

watch(windowFocused, () => {
  if (!windowFocused.value) {
    handleCloseCreateDir();
  }
});

const scrollToFocusItem = () => {
  setTimeout(() => {
    document.querySelector("[data-active=true]")?.scrollIntoView({
      inline: "center",
      block: "center",
    });
  }, 100);
};

onMounted(() => {
  scrollToFocusItem();
});

const actionButtons = [
  {
    title: "Terminal",
    icon: "fa-terminal text-xs",
    click: () => toggleTerminal(),
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
    click: () => {
      folderStore.reloadFolder();

      nextTick(scrollToFocusItem);
    },
  },
];

const handlePaste = async () => {
  try {
    if (!clipboard.value) return;

    let dirMoveName = path.parse(clipboard.value.path).base;

    let dirDist = path.join(folderStore.openFolder || "", dirMoveName);

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

const handleContextMenu = ({}) => {
  const folderMenus = [
    { label: "Create File", action: () => handleClickCreateDir(true) },
    { label: "Create Folder", action: () => handleClickCreateDir(false) },
    ...(clipboard.value
      ? [{ label: "Paste", action: () => handlePaste() }]
      : []),
  ];

  contextMenuStore.openContextMenu(folderMenus);
};

emitter.on("reloadFolder", () => (componentKey.value += 1));
</script>

<template>
  <div class="flex flex-col h-full select-none">
    <div class="flex items-center justify-between px-4 py-2 bg-bgMain">
      <span class="text-xs font-light">Explorer</span>

      <div class="flex">
        <template v-for="{ icon, title, click } in actionButtons">
          <IconButton :title @click="click" size="sm">
            <i :class="['fa-solid', icon]"></i>
          </IconButton>
        </template>
      </div>
    </div>

    <div
      class="h-full py-2 pr-2 overflow-x-hidden sideBar grow"
      @contextmenu.prevent="handleContextMenu({ path })"
    >
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

      <ExplorerItemRecursive
        :key="componentKey"
        v-if="folderStore.openFolder"
        :isOpen="true"
        :path="folderStore.openFolder"
      />
    </div>

    <!-- <div class="flex items-center justify-between px-2 py-2 bg-bgSecondary">
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
    </div> -->
  </div>
</template>
