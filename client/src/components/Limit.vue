<template>
  <div class="ml-2 md:mr-1 w-8 h-8 bg-red-400 hover:bg-red-600 border-2 border-red-600 flex items-center">
    <select
      v-model="selectedOption"
      @change="$emit('changeLimit', selectedOption)"
      class="bg-transparent appearance-none flex mx-auto outline-none"
    >
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineEmits<{ (e: 'changeLimit', value: number): void }>()
const props = defineProps<{ currentLimit: number }>()
const options = ref([10, 20, 30, 40, 50])
const selectedOption = ref(props.currentLimit)
</script>
