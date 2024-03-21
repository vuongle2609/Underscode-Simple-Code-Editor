<script setup lang="ts">
import { useFolderStore } from "@/stores/folder";
import fs from "fs";
import langDetector from "language-detect";
import langMapper from "language-map";
import {
  nextTick,
  onMounted,
  onUpdated,
  ref,
  shallowRef,
  watchEffect,
} from "vue";
const folderStore = useFolderStore();
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useEditorsOpenStore } from "@/stores/editorsOpen";
import { storeToRefs } from "pinia";

const editorsOpenStore = useEditorsOpenStore();
const { focusEditor, openEditors } = storeToRefs(editorsOpenStore);

const editor = ref();
let a: monaco.editor.IStandaloneCodeEditor | undefined;

onMounted(() => {
  a = monaco.editor.create(editor.value, {
    value: "",
    language: "",
    automaticLayout: true,
    formatOnType: false,
    formatOnPaste: false,
    theme: "vs-dark",
    // extraEditorClassName: focusEditor.value || "",
  });
});

const mapFileContent = async (id: string | null) => {
  if (!id) return;

  const currentFocusEditor = openEditors.value.find((item) => item.id === id);

  if (!currentFocusEditor) return;

  const value = await fs.promises.readFile(currentFocusEditor.path, "utf8");

  //@ts-ignore
  const langDetected = await langDetector.sync(currentFocusEditor.path);

  const language = langMapper[langDetected as keyof typeof langMapper].aceMode;

  await nextTick();

  Array.from(
    document.querySelectorAll<HTMLDivElement>(".monaco-editor")
  ).forEach((item) => {
    item.style.display = "hidden";
  });

  // const currentIdElementEditor = document.querySelector<HTMLDivElement>(
  //   "." + focusEditor.value
  // );

  // if (currentIdElementEditor) {
  //   currentIdElementEditor.style.display = "block";
  //   return;
  // }
  // monaco.editor.getModel();
  a?.dispose()
  monaco.editor.createModel(value, language);
  monaco.editor.getModels();
};

watchEffect(() => {
  if (focusEditor.value) mapFileContent(focusEditor.value);
});
</script>

<template>
  <div id="editor" ref="editor" class="w-full h-full"></div>
</template>
