<template>
  <video muted ref="videoElement" width="100%" class="bg-black"></video>
  <div class="flex justify-between">
    <VideoControls
      @play="play"
      @stop="stop"
      @fullscreen="videoElement?.requestFullscreen()"
    />
    <div class="mt-4">
      <ConfigurationControls v-model="configuration" />
    </div>
  </div>
  <div class="mt-4 flex gap-4">
    <AddMediaButton @add-media="addMedia" />
    <button @click="generate">Generate Queue</button>
    <button @click="shuffle">Shuffle Queue</button>
  </div>
  <div class="grid grid-cols-2 grid-rows-1 gap-6">
    <div class="mt-4">
      <FileEntry v-for="[id, file] in videos.entries()"
        :file="file.file"
        :meta="file.meta"
        @remove="removeFile(id)"
      />
    </div>
    <div>
      <template v-if="nowPlaying && !videoElement?.paused">
        <div class="mb-3 font-bold">[[Now Playing]]</div>
        <QueueEntry :entry="nowPlaying" class="bg-amber-700 mb-4" />
      </template>

      <hr class="mb-4 w-3/4 m-auto">
      <div class="mb-3 font-bold">[[ up next ]]</div>
      <p>
        Total queued: {{ totalQueued }}
      </p>
      <template v-for="entry in queue" :key="entry.id">
        <QueueEntry :entry="entry" class="mb-3 bg-gray-700" />
      </template>

      <div class="mb-3 font-bold">[[ history ]]</div>
      <template v-for="entry in history" :key="entry.id">
        <QueueEntry :entry="entry" class="mb-3" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import VideoControls from './components/VideoControls.vue';
import FileEntry from './components/FileEntry.vue';
import AddMediaButton from './components/AddMediaButton.vue';
import ConfigurationControls from './components/ConfigurationControls.vue';
import QueueEntry from './components/QueueEntry.vue';
import { useClipQueue } from './composables/clip-queue';

const videoElement = ref<HTMLVideoElement|null>(null);

const {
  files: videos,
  history,
  queue,
  params: configuration,
  nowPlaying,
  dequeue,
  addFile,
  removeFile,
  shuffle,
  generate
} = useClipQueue();

const totalQueued = computed(() => {
  const durationS = queue.value.reduce((acc, cur) => acc + cur.duration, 0);
  const hours = `0${Math.floor(durationS / 3600)}`;
  const minutes = `0${Math.floor((durationS % 3600) / 60)}`;

  return `${hours.slice(-2)}:${minutes.slice(-2)}`;
})

const timeout = ref<number|null>(null);

function play() {
  if (!videoElement.value?.paused || !videoElement.value || !videos.value.size) return;
  if (queue.value.length === 0) return;

  playFromQueue(videoElement as Ref<HTMLVideoElement>);
}

function playFromQueue(videoElement: Ref<HTMLVideoElement>) {
  const video = dequeue();

  if (!video || !videoElement) {
    stop();
    return;
  }

  const file = videos.value.get(video.fileId)?.file;
  if (!file) {
    stop();
    return;
  }

  videoElement.value.src = URL.createObjectURL(file);
  videoElement.value.currentTime = video.from;
  timeout.value = setTimeout(playFromQueue, video.duration * 1000, videoElement)
  videoElement.value.play()
}

function stop() {
  videoElement.value?.pause();

  if (timeout.value) {
    clearTimeout(timeout.value);
    timeout.value = null;
  }
}

function addMedia(files: ProcessedFile[]) {
  for (const file of files) {
    addFile(file);
  }
}

</script>

