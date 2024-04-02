import * as remote from "@electron/remote";
import { defineStore } from "pinia";
import { nextTick, ref } from "vue";
import { useEditorsOpenStore } from "./editorsOpen";

export const useFolderStore = defineStore("folder", () => {
  const editorsOpenStore = useEditorsOpenStore();
  // const openFolder = ref<null | string>(null);
  const openFolder = ref<null | string>(
    "/Users/thuynguyen/study/nothing/vuongle/vscode"
  );

  const changeOpenFolder = (newFolder: string) => {
    openFolder.value = newFolder;
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
    changeOpenFolder,
    reloadFolder,
    chooseFolder,
    closeFolder,
  };
});
