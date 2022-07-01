<template>
  <div
    class="w-8 h-8 text-xl bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center justify-center cursor-pointer"
    @click="$emit('changeOrder', props.currentOrder === 'a' ? 'd' : 'a')"
  >
    <span>{{ emojiIcon }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

defineEmits<{ (e: 'changeOrder', value: 'a' | 'd'): void }>()
const props = defineProps<{ currentOrder: string }>()
const emojiIcon = computed(() => ({ a: '👇', d: '☝️' }[props.currentOrder]))
</script>
