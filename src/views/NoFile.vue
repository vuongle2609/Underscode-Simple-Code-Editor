<script setup lang="ts">
import Button from "@/components/general/Button.vue";
import { useFolderStore } from "@/stores/folder";

const folderStore = useFolderStore();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen gap-6 p-5 bg-bgSecondary"
  >
    <img src="/AppIcon.svg" alt="App Icon" class="max-w-[10%]" />

    <div class="flex flex-col items-center gap-4 text-white">
      <h1 class="text-xl">Welcome to Underscode</h1>

      <div class="flex flex-col items-center gap-2">
        <span class="text-slate-400">To start, choose a project</span>

        <Button variant="filled" @click="folderStore.chooseFolder()"
          >Open Folder</Button
        >
      </div>

      <!-- <div class="flex flex-col items-center gap-2">
        <span class="text-slate-400">Or clone a repository</span>

        <Button variant="filled">Clone Repository</Button>
      </div> -->
    </div>
  </div>
</template>
