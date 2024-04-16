import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface ClipboardType {
  path: string;
  isFile: boolean;
}

export const useClipboardStore = defineStore("clipboard", () => {
  const cutClipboard = ref<ClipboardType | null>(null);
  const copyClipboard = ref<ClipboardType | null>(null);

  const clipboard = computed(() => {
    const clipboard = cutClipboard.value || copyClipboard.value;

    return (
      !!clipboard && {
        isCut: !!cutClipboard.value,
        ...clipboard,
      }
    );
  });

  const handleCopy = (path: string, isFile: boolean) => {
    copyClipboard.value = { path, isFile };
    cutClipboard.value = null;
  };

  const handleCut = (path: string, isFile: boolean) => {
    cutClipboard.value = { path, isFile };
    copyClipboard.value = null;
  };

  const handleClearClipboardPath = () => {
    cutClipboard.value = null;
    copyClipboard.value = null;
  };

  return {
    handleCut,
    handleCopy,
    handleClearClipboardPath,
    cutClipboard,
    copyClipboard,
    clipboard,
  };
});
