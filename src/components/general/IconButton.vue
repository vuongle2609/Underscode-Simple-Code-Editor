<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "filled" | "subtle";
}

const { size, variant } = defineProps<Props>();

const sizeStyle = {
  sm: "text-xs size-6",
  md: "text-md size-8",
  lg: "text-lg size-9",
  xl: "text-xl size-10",
};

const variantStyle = {
  filled: "bg-bgButton",
  subtle: "",
};
</script>

<template>
  <button
    :class="[sizeStyle[size || 'md'], variantStyle[variant || 'subtle']]"
    class="px-1 py-1 rounded-md hover:bg-bgButtonHover active:bg-bgSecondary aspect-square"
    v-bind="$props"
  >
    <slot />
  </button>
</template>
