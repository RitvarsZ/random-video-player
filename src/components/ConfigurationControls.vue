<template>
  <div class="flex gap-4">
    <div>
      <label for="min">Min duration:</label>
      <input 
        v-model="model.min"
        name="min" 
        type="number" 
        class="block px-2 py-1 rounded-lg" 
        step="1"
        min="1"
        :max="model.max"
      />
    </div>
    <div>
      <label for="max">Max duration:</label>
      <input 
        v-model="model.max"
        name="max" 
        type="number" 
        class="block px-2 py-1 rounded-lg" 
        step="1"
        :min="model.min"
        max="240"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<{min: number, max: number}>('modelValue', { required: true })
</script>
