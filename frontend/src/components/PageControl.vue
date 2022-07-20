<template>
  <div class="flex items-center justify-between">
    <div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="$emit('previous')"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <span
          href="#"
          class="bg-white border-primary-300 text-primary-500 relative items-center px-4 py-2 border text-sm font-medium"
        >
          {{ page }}
        </span>
        <button
          @click="$emit('next')"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

defineProps<{ page: number }>()
defineEmits<{ (e: 'next'): void; (e: 'previous'): void }>()
</script>
