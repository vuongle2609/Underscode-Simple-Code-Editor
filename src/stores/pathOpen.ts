import { getAbsolutePath } from "@/utils/file";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePathOpenStore = defineStore("pathOpen", () => {
  const openFolderPath = ref<Record<string, true>>({});
  const currentFocusPathNav = ref<string | null>(null);

  const openFolder = (pathToggle: string) => {
    openFolderPath.value = {
      ...openFolderPath.value,
      [pathToggle]: true,
    };
  };

  const closeFolder = (pathToggle: string) => {
    const openFolderPathClone = { ...openFolderPath.value };

    delete openFolderPathClone[pathToggle];

    openFolderPath.value = openFolderPathClone;
  };

  const toggleFolder = (pathToggle: string) => {
    const newPathToggle = getAbsolutePath(pathToggle);

    if (openFolderPath.value[pathToggle]) {
      closeFolder(pathToggle);

      return;
    }

    openFolder(newPathToggle);
  };

  return { toggleFolder, openFolderPath, currentFocusPathNav };
});
