<script setup lang="ts">
import { mainTheme } from "@/config/theme";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { nextTick, shallowRef, watchEffect } from "vue";

interface PropsType {
  fileDetail: {
    name: string;
    path: string;
    fileClass: string;
    id: string;
  };
}

const { fileDetail } = defineProps<PropsType>();

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
    // TODO: change to stream file
    const value = await fs.promises.readFile(fileDetail.path, "utf8");

    const newModel =
      monaco.editor.getModel(monaco.Uri.file(fileDetail.path)) ||
      monaco.editor.createModel(
        value,
        undefined,
        monaco.Uri.file(fileDetail.path)
      );

    editorRef.value?.setModel(newModel);
  } catch (err) {
    console.error(err);
  }
};

watchEffect(async () => {
  if (focusEditor.value) {
    // prevent some time model not update content
    await nextTick();
    mapFileContent(focusEditor.value);
  }
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
