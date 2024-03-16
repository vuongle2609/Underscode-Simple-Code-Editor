import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useFolderStore = defineStore("counter", () => {
  const openFolder = ref<null | string>("D:\\code\\Aim-Lab-ThreeJS");

  const openFile = ref<null | string>(null);

  function changeOpenFolder(newFolder: string) {
    openFolder.value = newFolder;
  }

  function changeOpenFile(path: string) {
    openFile.value = path;
  }

  return { openFolder, openFile, changeOpenFolder, changeOpenFile };
});
