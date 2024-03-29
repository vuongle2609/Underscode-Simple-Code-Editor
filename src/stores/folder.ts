import { defineStore } from "pinia";
import { nextTick, ref } from "vue";
import * as remote from "@electron/remote";
import { useEditorsOpenStore } from "./editorsOpen";

export const useFolderStore = defineStore("folder", () => {
  const editorsOpenStore = useEditorsOpenStore();
  // const openFolder = ref<null | string>(null);
  const openFolder = ref<null | string>("D:/code/blog");

  const openFile = ref<null | string>(null);

  const changeOpenFolder = (newFolder: string) => {
    openFolder.value = newFolder;
  };

  const changeOpenFile = (path: string) => {
    openFile.value = path;
  };

  const reloadFolder = async () => {
    const prevOpen = openFolder.value;

    openFolder.value = null;

    await nextTick();

    openFolder.value = prevOpen;
  };

  const closeFolder = () => {
    openFolder.value = null;
  };

  const chooseFolder = async () => {
    const showDialog = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (!showDialog.filePaths[0]) return;

    changeOpenFolder(showDialog.filePaths[0]);

    editorsOpenStore.resetEditor();
  };

  return {
    openFolder,
    openFile,
    changeOpenFolder,
    changeOpenFile,
    reloadFolder,
    chooseFolder,
    closeFolder,
  };
});
