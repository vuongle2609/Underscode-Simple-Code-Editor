import { defineStore } from "pinia";
import { v4 } from "uuid";
import { nextTick, ref } from "vue";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import fs from "fs";

interface EditorProps {
  name: string;
  path: string;
  fileClass: string;
  id: string;
}

export const useEditorsOpenStore = defineStore("editorsOpen", () => {
  const openEditors = ref<EditorProps[]>([]);

  const focusEditor = ref<null | string>(null);

  const addEditor = async (props: Omit<EditorProps, "id">) => {
    const id = v4();

    const foundEditor = openEditors.value?.find(
      (item) => item.path === props.path
    );
    if (foundEditor) {
      focusEditor.value = foundEditor.id;

      return;
    }

    openEditors.value.push({ ...props, id });

    await nextTick();

    // focus into it

    focusEditor.value = id;
  };

  const removeEditor = async (id: string): Promise<EditorProps | null> => {
    let itemRemove: EditorProps | null = null;

    openEditors.value = openEditors.value.filter((item) => {
      if (item.id == id) itemRemove = item;

      return item.id !== id;
    });

    // closed editor has same path with focus editor then change
    // focus editor to last path in open editors
    setTimeout(
      () => (focusEditor.value = openEditors.value.at(0)?.id || null),
      50
    );

    return itemRemove;
  };

  const handleSaveEditor = () => {
    const currentFocusEditor = openEditors.value.find(
      (item) => item.id === focusEditor.value
    );

    if (!currentFocusEditor) return;

    const newValue = monaco.editor.getEditors()[0].getValue() || "";

    fs.writeFileSync(currentFocusEditor.path, newValue);
  };

  const resetEditor = () => {
    openEditors.value = [];
    focusEditor.value = null;
  };

  const handleSaveAllEditor = async () => {
    Object.values(openEditors.value).forEach((editor) => {
      const newValue =
        monaco.editor.getModel(monaco.Uri.file(editor.path))?.getValue() || "";

      fs.writeFileSync(editor.path, newValue);
    });
  };

  return {
    openEditors,
    focusEditor,
    addEditor,
    removeEditor,
    resetEditor,
    handleSaveEditor,
    handleSaveAllEditor,
  };
});
