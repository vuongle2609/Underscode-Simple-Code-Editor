<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "@/components/bussiness/NavBar.vue";
import TabBar from "@/components/bussiness/TabBar.vue";
import "file-icons-js/css/style.css";
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <TabBar />

    <NavBar />

    <div class="max-w-full grow bg-bgSecondary">
      <RouterView />
    </div>
  </div>
</template>
