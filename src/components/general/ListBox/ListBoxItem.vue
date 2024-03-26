<script setup lang="ts">
import Button, { type ButtonProps } from "@/components/general/Button.vue";

interface PropsType extends ButtonProps {
  icon?: string;
}

defineProps<PropsType>();
</script>

<template>
  <Button v-bind="$props" :full-width="true">
    <div class="h-fit flex items-center min-w-3" v-if="icon">
      <i class="fa-solid text-sm text-white" :class="[icon]"></i>
    </div>

    <span class="text-sm text-white"><slot /></span>
  </Button>
</template>
