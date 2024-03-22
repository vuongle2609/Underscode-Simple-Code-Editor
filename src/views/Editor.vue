<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/bussiness/NavBar.vue";
import TabBar from "@/components/bussiness/TabBar.vue";
import OpenEditors from "./OpenEditors.vue";
import PathEditor from "./PathEditor.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden max-w-[100vw]">
    <TabBar />

    <NavBar />

    <div class="flex flex-col overflow-hidden grow bg-bgSecondary">
      <OpenEditors />

      <PathEditor />

      <RouterView />
    </div>
  </div>
</template>
