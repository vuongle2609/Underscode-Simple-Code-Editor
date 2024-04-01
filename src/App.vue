<script setup lang="ts">
import { useFolderStore } from "./stores/folder";
import Editor from "./views/Editor.vue";
import NoFile from "./views/NoFile.vue";

const folderStore = useFolderStore();
</script>

<template>
  <NoFile v-if="!folderStore.openFolder" />

  <Editor v-if="folderStore.openFolder" />
</template>
