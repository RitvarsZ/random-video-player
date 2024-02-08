<template>
  <div>
    <ul class="p-2 py-3">
      <li class="font-semibold">{{ entry.title }}</li>
      <li>Duration: {{ entry.duration }}s</li>
      <li>From: {{ entry.from }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  entry: PlaybackQueueEntry,
}>();
</script>

