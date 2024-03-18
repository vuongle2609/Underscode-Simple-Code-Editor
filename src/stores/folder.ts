import { defineStore } from "pinia";
import { ref } from "vue";

export const useFolderStore = defineStore("counter", () => {
  const openFolder = ref<null | string>(null);

  const openFile = ref<null | string>(null);

  function changeOpenFolder(newFolder: string) {
    openFolder.value = newFolder;
  }

  function changeOpenFile(path: string) {
    openFile.value = path;
  }

  return { openFolder, openFile, changeOpenFolder, changeOpenFile };
});
