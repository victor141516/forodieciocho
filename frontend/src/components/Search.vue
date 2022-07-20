<template>
  <div>
    <form class="flex rounded-md shadow-sm" @submit.prevent="$emit('search', searchTerm)" action="">
      <div class="relative flex flex-col items-stretch flex-grow focus-within:z-10">
        <input
          v-model="searchTerm"
          type="text"
          class="focus:ring-primary-500 focus:border-primary-500 block w-full rounded-none rounded-tl -md sm:text-sm border-primary-300 placeholder:text-primary-200"
          placeholder="Tetas, culos..."
        />
        <div class="flex text-xs rounded-bl-md border-b border-l border-primary-300 text-primary-600">
          <button
            type="button"
            class="flex-1 border-primary-300 -primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            :class="{ 'border-l': i !== 0, 'rounded-bl-md': i === 0 }"
            @click="onShortcutClick(shortcut)"
            v-for="(shortcut, i) in shortcuts"
            :key="shortcut"
          >
            {{ shortcut }}
          </button>
        </div>
      </div>

      <button
        type="submit"
        class="-ml-px relative inline-flex items-center space-x-2 px-3 py-2 border border-primary-300 text-sm font-medium rounded-r-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
      >
        <SearchIcon class="h-5 w-5 text-primary-400" aria-hidden="true" />
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SearchIcon } from '@heroicons/vue/solid'

const emit = defineEmits<{ (e: 'search', term: string): void }>()
const props = defineProps<{ initTerm: string }>()
const searchTerm = ref(props.initTerm)
const shortcuts = ref(['+18', '+16', '+14', '+hd', '+prv'])
const onShortcutClick = (shortcut: string) => {
  searchTerm.value = shortcut
  emit('search', searchTerm.value)
}
</script>
