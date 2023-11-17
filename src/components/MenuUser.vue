<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue';
import Trip from './modal/Trip.vue';

const emit = defineEmits(['user-button'])
const handleUserButton = () => {
    emit('user-button');
};
const showTrip = ref(false)

function handleOpenTrip() {
    showTrip.value = true
}
function handleCloseTrip() {
    showTrip.value = false
}
</script>

<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton @click="handleUserButton" class="w-full h-[5vh]
            ">
                <div class="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-50 w-56 origin-bottom-right rounded-md bg-beigeCustom shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <button @click="handleOpenTrip"
                        :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block px-4 py-2 text-left text-sm font-semibold w-full h-full']">Mes
                        trajets

                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button
                        :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block px-4 py-2 text-left text-sm font-semibold  w-full h-full']">Option
                        du compte</button>
                    </MenuItem>
                    <form method="POST" action="#">
                        <MenuItem v-slot="{ active }">
                        <button type="submit"
                            :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block w-full px-4 py-2 text-left text-sm font-semibold h-full']">Déconnexion</button>
                        </MenuItem>
                    </form>
                </div>
            </MenuItems>

        </transition>
        <div class="fixed inset-x-0 bottom-0 flex justify-center">
            <Trip v-show="showTrip" @close="handleCloseTrip" />
        </div>
    </Menu>
</template>
  
