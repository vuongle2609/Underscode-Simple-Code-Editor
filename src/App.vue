<script setup lang="ts">
import { useFolderStore } from "./stores/folder";
import Editor from "./views/Editor.vue";
import NoFile from "./views/NoFile.vue";

const folderStore = useFolderStore();
</script>

<template>
  <div class="h-screen w-screen overflow-hidden">
    <NoFile v-if="!folderStore.openFolder" />

    <Editor v-if="folderStore.openFolder" />
  </div>
</template>
