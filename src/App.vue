<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/bussiness/NavBar.vue';
import TabBar from '@/components/bussiness/TabBar.vue';
</script>

<template>
  <div class="flex w-screen h-screen">
    <TabBar />

    <NavBar />

    <div class="grow bg-bgSecondary">
      <RouterView />
    </div>
  </div>
</template>./components/bussiness/TabBar.vue
