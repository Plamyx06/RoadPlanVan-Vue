<script setup>
import { defineComponent, h, ref } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { MinusSmallIcon, PlusSmallIcon, UserCircleIcon } from '@heroicons/vue/24/outline'
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  CurrencyEuroIcon,
  TruckIcon,
  MapIcon,
  ClockIcon
} from '@heroicons/vue/20/solid'
import Logo from '@/components/Logo.vue'
import DividerWithMainButton from '@/components/button/DividerWithMainButton.vue'
import MainButton from '@/components/button/MainButton.vue'
import InterrogationAndMapPin from '@/components/InterrogationAndMapPin.vue'
import { RouterLink, useRouter } from 'vue-router'
import RegisterModal from '@/components/mapView/modal/RegisterModal.vue'
import ContinueItinerayModal from '@/components/mapView/modal/ContinueItineraryModal.vue'
import mapEmitter from '@/components/mapView/mapEvent.js'

const showContinueItinerayModal = ref(false)
const showRegisterModal = ref(false)
const router = useRouter()



function handleStart() {
  console.log('stored', localStorage)
  const itineraryWaypoints = JSON.parse(localStorage.getItem('itinerary-waypoints'))

  if (itineraryWaypoints === null) {
    router.push('/map')
    localStorage.removeItem('itinerary-options')
  } else {
    if (itineraryWaypoints.length === 1) {
      router.push('/map')
      localStorage.removeItem('itinerary-waypoints')
      localStorage.removeItem('itinerary-options')
    } else {
      showContinueItinerayModal.value = true
    }
  }
}

function handleContinueRoadTrip() {
  router.push('/map')
  showContinueItinerayModal.value = false
  mapEmitter.emit('load-roadtrip-storage')
}

function handleResetRoadTrip() {
  localStorage.removeItem('itinerary-options')
  localStorage.removeItem('itinerary-waypoints')
  showContinueItinerayModal.value = false
  console.log('itinerary', localStorage)
  router.push('/map')
}

function handleRegister() {
  showRegisterModal.value = true
}

function handleCloseRegisterModal() {
  showRegisterModal.value = false
}

const features = [
  {
    name: 'Estime ton budget',
    description: 'Calcule le coût de ton road trip',
    icon: CurrencyEuroIcon
  },
  {
    name: 'Estime le temps de tes trajets',
    description: 'Obtiens des estimations précises du temps de trajet entre chaque ville',
    icon: ClockIcon
  },
  {
    name: 'Visualise tes destinations',
    description: "Une carte intéractive qui te montre l'itinéraire de ton road trip",
    icon: MapIcon
  },
  {
    name: 'Sauvegarde tes trajets',
    description: 'Enregistre tes itinéraires pour les consulter ou les modifier plus tard',
    icon: CloudArrowUpIcon
  },
  {
    name: 'Organise ton road trip',
    description: 'Ajuste ton itinéraire en fonction de tes préférences',
    icon: ArrowPathIcon
  },
  {
    name: 'Adapté à la van life',
    description: "Tout l'itineraire sera réalisable avec ton véhicule",
    icon: TruckIcon
  }
]

const faqs = [
  {
    question: 'Pourquoi utiliser Roadplanvan ?',
    answer:
      "Roadplanvan est idéal car il vous permet non seulement de créer un itinéraire, de le sauvegarder et de le reprendre plus tard, mais il fournit également des informations essentielles telles que le temps de trajet, la distance parcourue et le coût estimé de l'essence."
  },
  {
    question: "Combien d'étapes puis-je ajouter à mon trajet ?",
    answer: 'Tu peux ajouter 22 étapes à ton trajet au maximum.'
  }
]

const footer = [

  {
    name: 'GitHub',
    href: 'https://github.com/Plamyx06',
    icon: defineComponent({
      render: () =>
        h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', {
            'fill-rule': 'evenodd',
            d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
            'clip-rule': 'evenodd'
          })
        ])
    })
  },

]

</script>
<template>
  <div class="bg-beige-custom">
    <!--Navbar Section-->
    <header class="absolute inset-x-0 top-0 z-10">
      <div class="flex justify-between items-center p-3">
        <div>
          <Logo class="w-4/6" />
        </div>
        <div>
          <UserCircleIcon @click="handleRegister" class="h-8 w-8 text-red-custom lg:h-10 lg:w-10" />
        </div>
      </div>
      <div class="fixed inset-x-0 bottom-0 flex justify-center">
        <RegisterModal v-show="showRegisterModal" @close="handleCloseRegisterModal" />
      </div>
    </header>

    <main>
      <!-- Hero section -->
      <div class="relative isolate overflow-hidden pb-16 pt-14 sm:pb-20">
        <img src="@/assets/main-van-on-road-desert.jpg" alt=""
          class="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true">
          <div
            class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-custom to-beige-custom opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style="
              clip-path: polygon(
                74.1% 44.1%,
                100% 61.6%,
                97.5% 26.9%,
                85.5% 0.1%,
                80.7% 2%,
                72.5% 32.5%,
                60.2% 62.4%,
                52.4% 68.1%,
                47.5% 58.3%,
                45.2% 34.5%,
                27.5% 76.7%,
                0.1% 64.9%,
                17.9% 100%,
                27.6% 76.8%,
                76.1% 97.7%,
                74.1% 44.1%
              );
            " />
        </div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div class="hidden sm:mb-8 sm:flex sm:justify-center"></div>
            <div class="text-center rounded-lg">
              <p class="mt-6 text-2xl leading-8 uppercase text-white font-bold sm:text-4xl lg:text-6xl">
                Ton compagnon de voyage
              </p>
              <p class="mt-3 text-2xl leading-8 text-white font-bold sm:text-4xl lg:text-4xl">
                Planifie ! Explore ! Profite !
              </p>
            </div>
            <div class="mt-10 flex justify-center items-center gap-x-6">
              <MainButton @click="handleStart"> Je commence </MainButton>
            </div>
          </div>
        </div>
      </div>
      <ContinueItinerayModal :show="showContinueItinerayModal" :continued="handleContinueRoadTrip"
        :reset="handleResetRoadTrip">
        Souhaites tu reprendre le road trip que tu as commencé ?
      </ContinueItinerayModal>

      <div class="mt-20 sm:mt-20 bg-beige-custom px-3 lg:px-8">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-7xl">
            <div class="md:flex md:justify-center md:items-center">
              <div class="md:flex-1 md:mr-5 md:mb-0">
                <p class="text-center mt-2 text-3xl font-bold tracking-tight text-red-custom sm:text-4xl">
                  Tu prépares un long road trip ?
                </p>
                <p class="mt-6 text-lg leading-8 text-black text-center">
                  Tu as une liste de villes et autres merveilles à découvrir, tant d'endroits
                  magnifiques qu'il devient difficile de savoir par où commencer...
                </p>
              </div>
              <div class="mb-4 md:flex-1 md:ml-5 md:mb-0">
                <InterrogationAndMapPin class="w-full" />
              </div>
            </div>
          </div>
        </div>
        <div class="border-[1px] border-red-custom mx-20 rounded-full my-16 lg:mx-96 md:hidden"></div>
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-7xl md:mt-32">
            <div class="md:flex md:justify-center md:items-center">
              <div class="flex-1 mb-4 md:ml-5 md:order-last">
                <p class="text-center mt-2 text-3xl font-bold tracking-tight text-red-custom sm:text-4xl">
                  L’organisation devient un problème ?
                </p>
                <p class="mt-6 text-lg leading-8 text-black text-center">
                  Avec autant de villes et de monuments, cela représente des heures de travail pour réussir à les relier
                  tout en étant sûr de ne pas se tromper.
                </p>
              </div>
              <div class="flex-1 md:mr-5">
                <img src="@/assets/van-in-desert.jpg" class="w-screen h-[320px] object-cover rounded-lg mr-10" />
              </div>
            </div>
          </div>
        </div>
        <div class="border-[1px] border-red-custom mx-20 rounded-full my-16 md:hidden"></div>
        <div class="mx-auto max-w-7xl px-6 mt-16 lg:px-8">
          <div class="mx-auto max-w-7xl">
            <div class="text-center">
              <p class="mt-2 text-3xl font-bold tracking-tight text-red-custom sm:text-4xl">
                Nous avons la solution !
              </p>
              <p class="mt-6 text-lg leading-8 text-black">
                Tu peux rechercher les villes que tu aimerais visiter et les ajouter à ton itinéraire. Tu disposeras d'un
                bouton pour les réorganiser, ce qui te permettra de trouver l'itinéraire
                le plus court incluant tous les lieux sélectionnés. Tu auras également la possibilité de modifier cet
                ordre si nécessaire.
              </p>
            </div>
          </div>
        </div>
        <div class="relative overflow-hidden mt-16">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <img src="@/assets/itinerary-exemple.jpg" alt="App screenshot"
              class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10" width="2432" height="1442" />
          </div>
        </div>
        <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl
            class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            <div v-for="feature in features" :key="feature.name" class="relative pl-9">
              <dt class="inline font-semibold text-gray-900">
                <component :is="feature.icon" class="absolute left-1 top-1 h-5 w-5 text-red-custom" aria-hidden="true" />
                {{ feature.name }}<br />
              </dt>
              {{ ' ' }}
              <dd class="inline">{{ feature.description }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Testimonial section -->
      <div class="relative z-10 mt-32 bg-red-custom pb-20 sm:mt-56 sm:pb-24 xl:pb-0">
        <div class="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div class="absolute left-[calc(50%-19rem)] top-[calc(50%-36rem)] transform-gpu blur-3xl">
            <div class="aspect-[1097/1023] w-[68.5625rem] bg-gradient-to-r from-red-custom to-beige-custom opacity-25"
              style="
                clip-path: polygon(
                  74.1% 44.1%,
                  100% 61.6%,
                  97.5% 26.9%,
                  85.5% 0.1%,
                  80.7% 2%,
                  72.5% 32.5%,
                  60.2% 62.4%,
                  52.4% 68.1%,
                  47.5% 58.3%,
                  45.2% 34.5%,
                  27.5% 76.7%,
                  0.1% 64.9%,
                  17.9% 100%,
                  27.6% 76.8%,
                  76.1% 97.7%,
                  74.1% 44.1%
                );
              " />
          </div>
        </div>
        <div
          class="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
          <div class="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
            <div class="relative aspect-[2/1] h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
              <img class="absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
                src="@/assets/my-van-and-me.jpg" alt="" />
            </div>
          </div>
          <div class="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
            <figure class="relative isolate pt-6 sm:pt-12">
              <svg viewBox="0 0 162 128" fill="none" aria-hidden="true"
                class="absolute left-0 top-0 -z-10 h-32 stroke-white/20">
                <path id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
                  d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z" />
                <use href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" x="86" />
              </svg>
              <blockquote class="text-xl font-semibold leading-8 text-beige-custom sm:text-2xl sm:leading-9">
                <p>
                  Lors de notre voyage de deux mois en République Tchèque, ma copine et moi avons eu
                  des difficultés à planifier les étapes de notre parcours. Nous nous sommes souvent
                  perdus. Cette expérience nous a inspirés à créer ce site pour faciliter notre
                  planification et nous avons décidé de le partager avec vous.
                </p>
              </blockquote>
              <figcaption class="mt-8 text-base">
                <div class="font-semibold text-beige-custom">Aurélien & Elodie</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <!-- FAQ section -->
      <div class="mx-auto my-32 max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-4xl divide-y divide-gray-900/10 mb-32 text-center">
          <h2 class="text-2xl font-bold mb-8 text-red-custom">
            Prêt pour commencer à planifier ton roadtrip ?
          </h2>
          <RouterLink to="/map">
            <DividerWithMainButton @click="handleStart"> Je commence </DividerWithMainButton>
          </RouterLink>
        </div>
        <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 class="text-2xl font-bold leading-10 tracking-tight text-red-custom">
            Questions fréquentes
          </h2>
          <dl class="mt-10 space-y-6 divide-y divide-red-900/10">
            <Disclosure as="div" v-for="faq in faqs" :key="faq.question" class="pt-6" v-slot="{ open }">
              <dt>
                <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                  <span class="text-base font-semibold leading-7">{{ faq.question }}</span>
                  <span class="ml-6 flex h-7 items-center">
                    <PlusSmallIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                    <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                  </span>
                </DisclosureButton>
              </dt>
              <DisclosurePanel as="dd" class="mt-2 pr-12">
                <p class="text-base leading-7 text-gray-600">{{ faq.answer }}</p>
              </DisclosurePanel>
            </Disclosure>
          </dl>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-red-custom">
      <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div class="flex justify-center space-x-6 md:order-2">
          <a v-for="item in footer" :key="item.name" :href="item.href" class="text-beige-custom hover:text-white">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div class="mt-8 md:order-1 md:mt-0">
          <p class="text-center text-xs leading-5 text-beige-custom">2024 RoadPlanVan.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
