<template>
  <div class="flex gap-4 mb-2 items-start">
    <img :src="props.meta.thumbnail" :alt="props.file.name" width="220">
    <div class="flex-grow">
      <p>{{props.file.name}}</p>
      <p>Duration: {{formatDuration(props.meta.duration)}}</p>
    </div>
    <button @click="$emit('remove')">Remove</button>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['remove']);
const props = defineProps<{
  file: File,
  meta: {thumbnail: string, duration: number}
}>();

function formatDuration (s:number) {
  let ms = s * 1000;
  if (ms < 0) ms = -ms;

  const time = {
    day: Math.floor(ms / 86400000),
    hour: Math.floor(ms / 3600000) % 24,
    min: Math.floor(ms / 60000) % 60,
    sec: Math.floor(ms / 1000) % 60,
  };

  return Object.entries(time)
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};
</script>
