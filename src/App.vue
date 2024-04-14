<script setup lang="ts">
import { useFolderStore } from "./stores/folder";
import Editor from "./views/Editor.vue";
import NoFile from "./views/NoFile.vue";
import ContextMenu from "@/components/general/ContextMenu.vue";

const folderStore = useFolderStore();
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <ContextMenu />

    <NoFile v-if="!folderStore.openFolder" />

    <Editor v-if="folderStore.openFolder" />
  </div>
</template>
