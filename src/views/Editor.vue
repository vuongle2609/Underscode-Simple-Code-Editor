<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/bussiness/NavBar.vue";
import TabBar from "@/components/bussiness/TabBar.vue";
import OpenEditors from "./OpenEditors.vue";
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <TabBar />

    <NavBar />

    <div class="flex flex-col max-w-full grow bg-bgSecondary">
      <OpenEditors />

      <RouterView />
    </div>
  </div>
</template>
