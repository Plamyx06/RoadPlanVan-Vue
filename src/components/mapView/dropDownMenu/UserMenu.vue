<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref, defineEmits } from 'vue';
import LoadTripModal from '@/components/mapView/modal/LoadTripModal.vue';

const emit = defineEmits(['user-button'])

function handleUserButton() {
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
            <MenuButton @click="handleUserButton" class="h-[5vh] w-full">
                <slot></slot>
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-50 w-56 origin-bottom-right rounded-md bg-beige-custom shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <button @click="handleOpenTrip"
                        :class="[active ? 'bg-red-custom text-beige-custom' : 'text-red-custom', 'block px-4 py-2 text-left text-sm font-semibold w-full h-full']">Mes
                        trajets

                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button
                        :class="[active ? 'bg-red-custom text-beige-custom' : 'text-red-custom', 'block px-4 py-2 text-left text-sm font-semibold  w-full h-full']">Option
                        du compte</button>
                    </MenuItem>
                    <form method="POST" action="#">
                        <MenuItem v-slot="{ active }">
                        <button type="submit"
                            :class="[active ? 'bg-red-custom text-beige-custom' : 'text-red-custom', 'block w-full px-4 py-2 text-left text-sm font-semibold h-full']">Déconnexion</button>
                        </MenuItem>
                    </form>
                </div>
            </MenuItems>

        </transition>
        <div class="fixed inset-x-0 bottom-0 flex justify-center">
            <LoadTripModal v-show="showTrip" @close="handleCloseTrip" />
        </div>
    </Menu>
</template>
  
