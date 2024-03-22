import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useFolderStore = defineStore("folder", () => {
  const openFolder = ref<null | string>("D:/code/DoriElectron");

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

  return {
    openFolder,
    openFile,
    changeOpenFolder,
    changeOpenFile,
    reloadFolder,
  };
});
