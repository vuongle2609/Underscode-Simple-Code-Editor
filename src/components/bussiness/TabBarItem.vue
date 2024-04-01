<script setup lang="ts">
import { ButtonHTMLAttributes } from "vue";

interface PropsType extends /** @vue-ignore */ ButtonHTMLAttributes {
  isActive?: boolean;
}

defineProps<PropsType>();
</script>

<template>
  <button
    :class="[
      isActive
        ? 'border-white text-white'
        : 'text-textSecondary border-transparent',
    ]"
    class="w-full px-3 py-2 border-0 border-l-2 border-solid hover:text-white"
    v-bind="$props"
  >
    <slot></slot>
  </button>
</template>
