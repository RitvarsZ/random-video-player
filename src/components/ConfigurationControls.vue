<template>
  <div>
    <div>
      <label for="min">Min duration: {{model.min?.valueOf()}}</label>
      <input 
        v-model="model.min"
        name="min" 
        type="range" 
        class="block" 
        step="1"
        min="1"
        :max="model.max"
      />
    </div>
    <div>
      <label for="max">Max duration: {{model.max?.valueOf()}}</label>
      <input 
        v-model="model.max"
        name="max" 
        type="range" 
        class="block" 
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
