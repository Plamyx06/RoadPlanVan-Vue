<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue';



const showTrip = ref(false)

function handleOpenTrip() {
    showTrip.value = true
}

</script>

<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton class="w-full ">
                <div class="flex justify-center items-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6 text-beigeCustom">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>

                </div>
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-50 w-fit origin-bottom-right rounded-md bg-beigeCustom shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <button @click="handleOpenTrip"
                        :class="[active ? 'bg-redCustom text-beigeCustom' : 'text-redCustom', 'block px-4 py-2 text-left text-sm font-semibold w-full h-full']">Modifier
                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button
                        :class="[active ? 'bg-red-500 text-beigeCustom' : 'text-red-500', 'block px-4 py-2 text-left text-sm font-semibold  w-full h-full']">Supprimer</button>
                    </MenuItem>
                </div>
            </MenuItems>

        </transition>

    </Menu>
</template>
  
