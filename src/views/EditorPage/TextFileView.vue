<script setup lang="ts">
import { mainTheme } from "@/config/theme";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { streamToString } from "@/utils/file";
const fs = require("fs-extra");
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { storeToRefs } from "pinia";
import { computed, shallowRef, watchEffect } from "vue";

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
    fontSize: 12,
  };

const mapFileContent = async (newFilePath: string) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ["node_modules/@types"],
  });

  // extra libraries
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `export declare function next() : string`,
    "node_modules/@types/external/index.d.ts"
  );

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  let model = monaco.editor.getModel(monaco.Uri.file(newFilePath));

  if (!model) {
    const stream = fs.createReadStream(newFilePath, { encoding: "utf8" });

    const text = await streamToString(stream);

    model = monaco.editor.createModel(
      text,
      undefined,
      monaco.Uri.file(newFilePath)
    );

    stream.destroy();
  }

  editorRef.value?.setModel(model);
};

const path = computed(() => props.fileDetail.path);

watchEffect(() => {
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
