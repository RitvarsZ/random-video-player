<template>
  <div class="mt-4 flex gap-4">
    <button @click="$emit('play')">Play</button>
    <button @click="$emit('stop')">Stop</button>
    <button @click="$emit('fullscreen')">Fullscreen</button>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['play', 'stop', 'fullscreen']);
</script>
