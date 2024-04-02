<script setup lang="ts">
import { mainTheme } from "@/config/theme";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { streamToString } from "@/utils/file";
import fs from "fs";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { computed, onMounted, shallowRef, watch } from "vue";

interface PropsType {
  fileDetail: {
    name: string;
    path: string;
    fileClass: string;
    id: string;
  };
}

const props = defineProps<PropsType>();

const editorsOpenStore = useEditorsOpenStore();
const { openEditors } = storeToRefs(editorsOpenStore);

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

const mapFileContent = async (newFilePath: string) => {
  let model = monaco.editor.getModel(monaco.Uri.file(newFilePath));

  if (!model) {
    const stream = fs.createReadStream(newFilePath, { encoding: "utf8" });

    const text = await streamToString(stream);

    model =
      monaco.editor.getModel(monaco.Uri.file(newFilePath)) ||
      monaco.editor.createModel(text, undefined, monaco.Uri.file(newFilePath));

    stream.destroy();
  }

  editorRef.value?.setModel(model);
};

const path = computed(() => props.fileDetail.path);

watch(path, async () => {
  mapFileContent(path.value);
});

onMounted(() => {
  mapFileContent(path.value);
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
