<template>
  <div class="flex items-center justify-between">
    <div>
      <nav class="z-0 flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <select
          @click="$emit('changeOrder', 'a')"
          class="flex-1 text-center px-2 py-2 rounded-l-md border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50 bg-none focus:border-primary-500 focus:outline-none focus:ring-primary-500 focus:z-10"
        >
          <option v-for="option in options" :value="option" :selected="currentLimit === option">
            {{ option }}
          </option>
        </select>
        <div class="flex-1 min-h-full flex flex-col">
          <button
            @click="$emit('changeOrder', 'd')"
            class="flex-1 h-full items-center rounded-tr-md border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50 focus:ring-primary-500 focus:ring-1 focus:z-10 focus:border-primary-500 px-1"
            :class="{
              'bg-red-200': currentOrder === 'd',
            }"
          >
            <span class="sr-only">Up</span>
            <ArrowUpIcon class="h-3 w-3" aria-hidden="true" />
          </button>
          <button
            @click="$emit('changeOrder', 'a')"
            class="flex-1 h-full items-center rounded-br-md border border-primary-300 bg-white text-sm font-medium text-primary-500 hover:bg-primary-50 focus:ring-primary-500 focus:ring-1 focus:z-10 focus:border-primary-500 px-1 -mt-px"
            :class="{
              'bg-red-200': currentOrder === 'a',
            }"
          >
            <span class="sr-only">Down</span>
            <ArrowDownIcon class="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/solid'

defineEmits<{ (e: 'changeLimit', value: number): void; (e: 'changeOrder', value: 'a' | 'd'): void }>()
const props = defineProps<{ currentLimit: number; currentOrder: string }>()
const options = ref([10, 20, 30, 40, 50])
const selectedOption = ref(props.currentLimit)
const emojiIcon = computed(() => ({ a: '👇', d: '☝️' }[props.currentOrder]))
</script>
