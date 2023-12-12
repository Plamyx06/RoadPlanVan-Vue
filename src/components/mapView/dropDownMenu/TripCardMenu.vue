<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'
import DeleteModal from '@/components/mapView/modal/DeleteModal.vue'

const showTrip = ref(false)
const showDeleteModal = ref(false)

function handleOpenTrip() {
    showTrip.value = true
}

function handleDeleteButton() {
    showDeleteModal.value = true
}

function handleCancel() {
    showDeleteModal.value = false
}

</script>

<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton class="w-full ">
                <div class="flex justify-center items-center rounded-full">
                    <EllipsisVerticalIcon class="w-5 h-5" />
                </div>
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems
                class="absolute right-0 z-50 w-fit origin-bottom-right rounded-md bg-beige-custom shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                    <button @click="handleOpenTrip"
                        :class="[active ? 'bg-red-custom text-beige-custom' : 'text-red-custom', 'block px-4 py-2 text-left text-sm font-semibold w-full h-full']">Modifier
                    </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <button @click="handleDeleteButton"
                        :class="[active ? 'bg-red-500 text-beige-custom' : 'text-red-500', 'block px-4 py-2 text-left text-sm font-semibold  w-full h-full']">Supprimer</button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>

        <DeleteModal :show="showDeleteModal" :cancel="handleCancel" :deleted="handleDelete">
            Veux-tu supprimer <span class="font-bold">Nom du voyage</span> de ton RoadTrip ?
        </DeleteModal>
    </Menu>
</template>
  
