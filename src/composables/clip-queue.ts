import { ref, Ref, reactive, computed } from "vue";

interface ClipConfiguration {
  min: number /** clip duration in seconds */;
  max: number;
}

export function useClipQueue() {
  const files: Ref<Map<string, ProcessedFile>> = ref(new Map());
  let history: Ref<PlaybackQueueEntry[]> = ref([]);
  let queue: Ref<PlaybackQueueEntry[]> = ref([]);
  let params: ClipConfiguration = reactive({ min: 5, max: 120 });

  let playableFiles: string[] = [];

  const nowPlaying = computed(() => {
    return history.value.at(-1) || null
  })

  /**
   * Based on files, params and historyc
   * adds a number of random clips to the queue.
   * clips can be repeated if the duration of the file is larger than 180.
   *  - otherwise they are removed from the list of playable files.
   * Clips cannot have overlapping playback times (from, duration)
   * Files which have been already played for 60% of their duration are removed from the playableFiles list.
   **/
  function enqueue(): void {
    if (!playableFiles.length) {
      console.warn('No playable files available.');

      return;
    }

    const fileId =
      playableFiles[
        Math.floor(Math.random() * playableFiles.length)
      ];
    const duration =
      Math.floor(Math.random() * (params.max - params.min)) +
      params.min;

    const lastFile = (() => {
      return queue.value.findLast((file) => file.fileId === fileId) || history.value.findLast((file) => file.fileId === fileId);
    })();
    const from = lastFile ? lastFile.from + lastFile.duration : 0;

    const file = files.value.get(fileId);

    if (file) {
      const played = history.value
        .filter((file) => file.fileId === fileId)
        .reduce((acc, file) => acc + file.duration + 10, 0);
      const willPlay = queue.value
        .filter((file) => file.fileId === fileId)
        .reduce((acc, file) => acc + file.duration + 10, 0);

      const playtime = played + willPlay
      if (playtime > file.meta.duration * 0.6) {
        playableFiles = playableFiles.filter((id) => id !== fileId);
      } else if (playtime + duration > file.meta.duration) {
        playableFiles = playableFiles.filter((id) => id !== fileId);

        return;
      }
    } else {
      console.warn(`File ${fileId} not found`);
      return
    }

    const entry: PlaybackQueueEntry = { 
      fileId, 
      title: file?.file.name, 
      from: from + 10, 
      duration 
    };

    queue.value = queue.value.concat([entry]);
  }

  function dequeue(): PlaybackQueueEntry | undefined {
    const next = queue.value.shift();

    if (!next) return undefined;

    history.value.push(next);

    return next;
  }

  function addFile(file: ProcessedFile) {
    playableFiles.push(file.id);

    return files.value.set(file.id, file);
  }

  function removeFile(id: string): boolean {
    playableFiles = playableFiles.filter((fileId) => fileId !== id);
    queue.value = queue.value.filter(entry => entry.fileId !== id);

    return files.value.delete(id);
  }

  /** 
   * Enqueue clips until there are no available videos left.
   */
  function generate(): void {
    while (playableFiles.length > 0) {
      enqueue();
    }
  }

  /** 
   * Shuffle the queue.
   */
  function shuffle(): void {
    queue.value.sort(() => Math.random() - 0.5);
  }

  return {
    /* state */
    files,
    history,
    queue,
    params,
    nowPlaying,
    /* methods */
    enqueue,
    dequeue,
    addFile,
    removeFile,
    generate,
    shuffle,
  }
}

