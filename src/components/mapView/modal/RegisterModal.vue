<script setup>
import RoundedButton from '@/components/button/RoundedButton.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { InboxArrowDownIcon, GlobeEuropeAfricaIcon } from '@heroicons/vue/20/solid'
import { defineEmits } from 'vue'
import LogoOnlyVan from '@/components/LogoOnlyVan.vue'

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 flex z-50 flex-1 flex-col justify-center py-12 px-3 w-full h-screen">
    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    <div class="sm:mx-auto sm:w-full sm:max-w-[480px] rounded-lg px-6 py-12 relative">
      <div class="bg-beige-custom px-6 py-6 shadow rounded-lg">
        <div class="flex justify-end">
          <RoundedButton @click="closeModal">
            <XMarkIcon class="h-4 w-4" />
          </RoundedButton>
        </div>
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <LogoOnlyVan class="mx-auto w-44" alt="logo" />
          <h2 class="text-center text-2xl font-bold tracking-tight text-red-custom">
            Je m'inscris ou me connecte !
          </h2>
        </div>
        <div>
          <div class="relative mt-6">
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <ul class="text-lg text-red-custom">
                <li class="flex">
                  <GlobeEuropeAfricaIcon class="h-6 w-6 mr-2" />
                  - Ajoute plus de villes
                </li>
                <li class="flex">
                  <InboxArrowDownIcon class="h-6 w-6 mr-2" /> - Sauvegarde tes trajets
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-6">
            <button @click="loginWithGoogle"
              class="flex w-full hover:border-[#db4a39] hover:border-2 bg-white items-center justify-center gap-3 rounded-md border px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4" />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853" />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05" />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              <span class="text-sm font-semibold leading-6">Google</span>
            </button>
            <div class="relative flex justify-center text-sm font-medium leading-6 mx-3">
              <span class="px-6 text-red-custom"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
