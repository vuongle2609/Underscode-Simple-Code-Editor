<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/views/NavBar";
import TabBar from "@/components/bussiness/TabBar.vue";
</script>

<template>
  <div class="flex h-screen overflow-hidden max-w-[100vw]">
    <TabBar />

    <NavBar />

    <div class="flex flex-col overflow-hidden grow bg-bgSecondary relative">
      <RouterView />
    </div>
  </div>
</template>
