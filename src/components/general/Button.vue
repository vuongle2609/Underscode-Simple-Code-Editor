<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue';

interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {
    size?: 'sm' | 'md' | 'lg' | 'xl',
    variant?: 'filled' | 'subtle',
    fullWidth?: boolean
}

const { size, variant, fullWidth } = defineProps<Props>()

const sizeStyle = {
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
}

const variantStyle = {
    filled: 'bg-bgButton',
    subtle: '',
}

const widthStyle = fullWidth ? 'w-full' : ''

const buttonStyle = [sizeStyle[size || 'md'], variantStyle[variant || 'subtle'], widthStyle]

</script>

<template>
    <button :class="buttonStyle"
        class="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-bgButtonHover active:bg-bgSecondary"
        v-bind="$props">
        <slot />
    </button>
</template>
