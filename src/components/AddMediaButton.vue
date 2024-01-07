<template>
  <button class="mb-2" @click="addMedia()">Add Media</button>
</template>


<script setup lang="ts">
export type ProcessedFile = {id: string, file: File, meta: { thumbnail: string, duration: number}}
const emit = defineEmits<{
  (e: 'add-media', files: ProcessedFile[]): void
}>();
async function addMedia() {
  const handles = await window.showOpenFilePicker({
    types: [
      {
        description: "Videos",
        accept: {
          "video/*": [".mp4", ".mkv"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: true,
  });

  const result: ProcessedFile[] = []
  for (const fileHandle of handles) {
    const fileData = await (fileHandle).getFile();
    // get random id
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const meta = await generateVideoMetadata(fileData)

    result.push({id, file: fileData, meta})
  }

  emit('add-media', result);
}

function generateVideoMetadata(file: File): Promise<{thumbnail: string, duration: number}> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve({
        thumbnail: canvas.toDataURL("image/png"),
        duration: video.duration,
      });
    };
  });
};
</script>
