<template>
    <div class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-red-custom" />
        </div>
        <div class="relative flex justify-center">
            <MainButton>
                <slot />
            </MainButton>
        </div>
    </div>
</template>
  
<script setup>
import MainButton from '@/components/button/MainButton.vue';
</script>