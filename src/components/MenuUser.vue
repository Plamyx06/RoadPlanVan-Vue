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
                    <a href="#"
                        :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block px-4 py-2 text-sm font-semibold']">Mes
                        trajets

                    </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                        :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block px-4 py-2 text-sm font-semibold']">Option
                        du compte</a>
                    </MenuItem>
                    <form method="POST" action="#">
                        <MenuItem v-slot="{ active }">
                        <button type="submit"
                            :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block w-full px-4 py-2 text-left text-sm font-semibold']">Déconnexion</button>
                        </MenuItem>
                    </form>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
  
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'


const emit = defineEmits(['user-button'])
const handleUserButton = () => {

    emit('user-button');
};
</script>