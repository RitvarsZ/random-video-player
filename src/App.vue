<template>
  <video muted ref="videoElement" width="100%" class="bg-black"></video>
  <VideoControls
    @play="play"
    @stop="stop"
    @fullscreen="videoElement?.requestFullscreen()"
  />
  <div class="mt-4">
    <ConfigurationControls v-model="configuration" />
  </div>
  <div class="mt-4">
    <AddMediaButton @add-media="addMedia" />
    <FileEntry v-for="[id, file] in videos.entries()"
      :file="file.file"
      :meta="file.meta"
      @remove="removeMedia(id)"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, Ref } from 'vue';
import VideoControls from './components/VideoControls.vue';
import FileEntry from './components/FileEntry.vue';
import AddMediaButton, { ProcessedFile } from './components/AddMediaButton.vue';
import ConfigurationControls from './components/ConfigurationControls.vue';

const videoElement = ref<HTMLVideoElement|null>(null);
const videos: Ref<Map<string, {
  file: File,
  meta: {thumbnail: string, duration: number}
}>> = ref(new Map())

const configuration = reactive({
  min: 5,
  max: 120,
})

const timeout = ref<number|null>(null);

function play() {
  if (!videoElement.value?.paused || !videoElement.value || !videos.value.size) return

  loadRandomVideo(videoElement as Ref<HTMLVideoElement>)
}

function loadRandomVideo (videoElement: Ref<HTMLVideoElement>) {
  // Get random video from videos map.
  const randomVideo = Array.from(videos.value.values())[Math.floor(Math.random() * videos.value.size)]

  if (!randomVideo) {
    stop();
    return;
  }

  videoElement.value.src = URL.createObjectURL(randomVideo.file);
  const duration = Math.floor(Math.random() * (configuration.max - configuration.min + 1) + configuration.min);
  // Get and set random start time
  const start = Math.floor(Math.random() * (randomVideo.meta.duration - duration)) || 1;
  videoElement.value.currentTime = start;
  timeout.value = setTimeout(loadRandomVideo, duration * 1000, videoElement)
  videoElement.value.play()
}

function stop() {
  videoElement.value?.pause();

  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
}

function addMedia(files: ProcessedFile[]) {
  for (const file of files) {
    videos.value.set(file.id, {file: file.file, meta: file.meta})
  }
}

function removeMedia(id: string) {
  videos.value.delete(id)
}
</script>

