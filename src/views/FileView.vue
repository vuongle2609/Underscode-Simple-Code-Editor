<script setup lang="ts">
import { useFolderStore } from "@/stores/folder";
import { ref, onMounted, shallowRef, watchEffect } from "vue";
import fs from "fs";
const folderStore = useFolderStore();

const code = ref("");

watchEffect(() => {
  if (folderStore.openFile)
    fs.readFile(folderStore.openFile, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      code.value = data;
    });
});

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};

const editorRef = shallowRef();
const handleMount = (editor: string) => (editorRef.value = editor);
</script>

<template>
  <vue-monaco-editor
    v-model:value="code"
    theme="vs-dark"
    :options="MONACO_EDITOR_OPTIONS"
    @mount="handleMount"
  />
</template>
