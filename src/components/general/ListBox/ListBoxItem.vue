<script setup lang="ts">
import Button, { type ButtonProps } from "@/components/general/Button.vue";

interface PropsType extends ButtonProps {
  icon?: string;
}

defineProps<PropsType>();
</script>

<template>
  <button
    class="flex items-center w-full gap-2 px-3 py-2 text-gray-400 rounded-md hover:text-white hover:bg-bgButtonHover active:bg-bgSecondary"
    v-bind="$props"
  >
    <div class="flex items-center justify-center h-fit min-w-4" v-if="icon">
      <i class="text-sm fa-solid" :class="[icon]"></i>
    </div>

    <span class="text-sm whitespace-nowrap"><slot /></span>
  </button>
</template>
