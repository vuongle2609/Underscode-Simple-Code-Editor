<script setup lang="ts">
import { mainTheme } from "@/config/theme";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { shallowRef, watchEffect } from "vue";

const editorsOpenStore = useEditorsOpenStore();
const { focusEditor, openEditors } = storeToRefs(editorsOpenStore);

const editorRef = shallowRef<monaco.editor.IStandaloneCodeEditor>();

monaco.editor.defineTheme("ace", mainTheme);

const MONACO_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions =
  {
    automaticLayout: true,
    formatOnType: false,
    formatOnPaste: false,
    scrollBeyondLastLine: true,
    theme: "ace",
    cursorSmoothCaretAnimation: "on",
  };

const mapFileContent = async (id: string | null) => {
  try {
    if (!id) return;

    const currentFocusEditor = openEditors.value.find((item) => item.id === id);

    if (!currentFocusEditor) return;

    const value = await fs.promises.readFile(currentFocusEditor.path, "utf8");

    const newModel =
      monaco.editor.getModel(monaco.Uri.file(currentFocusEditor.path)) ||
      monaco.editor.createModel(
        value,
        undefined,
        monaco.Uri.file(currentFocusEditor.path)
      );

    editorRef.value?.setModel(newModel);
  } catch (err) {
    console.error(err);
  }
};

watchEffect(() => {
  if (focusEditor.value) mapFileContent(focusEditor.value);
});

const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
  editorRef.value = editor;

  editorRef.value?.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    editorsOpenStore.handleSaveEditor
  );
};

// editorRef.value?.addAction({
//   id: "save",
//   label: "save",
//   keybindings: [monaco.KeyMod.CtrlCmd, monaco.KeyCode.KeyS],
//   run: () => console.log(1),
// });
</script>

<template>
  <vue-monaco-editor
    v-if="openEditors.length"
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
    class="pt-2"
  />
</template>
