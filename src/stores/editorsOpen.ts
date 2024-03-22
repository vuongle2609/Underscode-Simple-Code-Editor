import { defineStore } from "pinia";
import { nextTick, reactive, ref, shallowRef } from "vue";
import { v4 } from "uuid";

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

  const removeEditor = async (id: string) => {
    openEditors.value = openEditors.value.filter((item) => item.id !== id);

    await nextTick();

    // closed editor has same path with focus editor then change
    // focus editor to last path in open editors
    if (id === focusEditor.value) {
      focusEditor.value = openEditors.value.at(0)?.id || null;
    }
  };

  return { openEditors, focusEditor, addEditor, removeEditor };
});
