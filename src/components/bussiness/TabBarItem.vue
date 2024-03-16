<script setup lang="ts">
import { reactive } from "vue";

defineProps({
    isActive: Boolean,
});
</script>

<template>
    <div :class="[isActive ? 'border-white text-white' : 'text-textSecondary border-transparent']"
        class="w-full px-3 py-2 border-0 border-l-2 border-solid hover:text-white">
        <slot></slot>
    </div>
</template>
