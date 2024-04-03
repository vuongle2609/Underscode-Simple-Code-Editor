<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from "vue";

export interface ButtonProps extends /** @vue-ignore */ ButtonHTMLAttributes {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "filled" | "subtle";
  fullWidth?: boolean;
  active?: boolean;
}

const { size, variant, fullWidth } = defineProps<ButtonProps>();

const sizeStyle = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

const variantStyle = {
  filled: "bg-bgButton",
  subtle: "",
};

const widthStyle = fullWidth ? "w-full" : "";

const buttonStyle = computed(() => [
  sizeStyle[size || "md"],
  variantStyle[variant || "subtle"],
  widthStyle,
]);
</script>

<template>
  <button
    class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bgButtonHover active:bg-bgSecondary data-[active=true]:bg-bgSecondary"
    :class="buttonStyle"
    v-bind="$props"
  >
    <slot />
  </button>
</template>
