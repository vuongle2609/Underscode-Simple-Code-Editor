import { defineStore } from "pinia";
import { ref } from "vue";
import { useFolderStore } from "./folder";
import { getAbsolutePath } from "@/utils/file";

export const usePathOpenStore = defineStore("pathOpen", () => {
  const openFolderPath = ref<Record<string, true>>({});

  const folderStore = useFolderStore();

  const openFolder = (pathToggle: string) => {
    openFolderPath.value.push(pathToggle);
  };

  const closeFolder = (pathToggle: string) => {
    openFolderPath.value = [
      ...openFolderPath.value.filter((item) => item !== pathToggle),
    ];
  };

  const toggleFolder = (pathToggle: string) => {
    const newPathToggle = getAbsolutePath(pathToggle);

    if (openFolderPath.value[pathToggle]) {
      closeFolder(pathToggle);

      return;
    }

    openFolder(newPathToggle);
  };

  return { toggleFolder, openFolderPath };
});
