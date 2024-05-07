<template>
  <div
    class="container flex flex-column justify-between items-center full-width full-height"
  >
    <div class="container__inner rounded-borders q-pa-md">
      <video class="full-width full-height" ref="video" autoplay muted></video>
    </div>
    <div class="q-pb-sm q-gutter-sm rounded-borders full-width">
      <q-btn
        flat
        class="bg-primary text-white"
        @click="startPauseStream"
        :label="videoStreaming ? 'Stop' : 'Play'"
        :icon-right="videoStreaming ? 'stop' : 'play_arrow'"
      >
      </q-btn>
      <q-btn
        v-if="videoStreaming"
        flat
        class="bg-primary text-white"
        @click="captureFrame"
        :disable="!videoStreaming"
        label="Capture Frame"
        icon-right="camera_alt"
      >
        <q-badge color="secondary" floating>{{ captureCount }}</q-badge>
      </q-btn>
      <q-btn
        v-if="captureCount"
        flat
        class="bg-white text-secondary"
        @click="toggleFrames"
        :label="isLeftDrawerOpen ? 'Hide Frames' : 'Show Frames'"
      >
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCaptureStore } from '../stores/capture.store';
import { useProjectStore } from 'src/stores/project.store';

const emit = defineEmits(['stop', 'start']);

const captureStore = useCaptureStore();
const video = ref<HTMLVideoElement | null>(null);
const videoStreaming = ref(false);

const canvas = ref<HTMLCanvasElement | null>(null);
if (!canvas.value) {
  canvas.value = document.createElement('canvas');
}

const captureCount = computed(() => {
  return captureStore.$state.frames.length;
});

const initializeVideoPlayer = () => {
  if (!video.value) return;
  video.value.src = '/examples/sample.mp4';
  video.value.volume = 0;
  video.value.load();

  video.value.addEventListener('loadeddata', () => {
    console.log('Video has loaded');
    try {
      video.value && video.value.play();
    } catch (error) {
      console.error('Error playing video:', error);
    }
    captureStore.startVideoStream();
    videoStreaming.value = true;
  });
};

const startPauseStream = () => {
  if (!video.value) return;
  if (videoStreaming.value) {
    video.value.pause();
    captureStore.stopVideoStream();
    emit('stop');
  } else {
    video.value.play();
    captureStore.startVideoStream();
    emit('start');
  }
  videoStreaming.value = !videoStreaming.value;
};

const captureFrame = () => {
  if (!video.value || !canvas.value) return;
  // create scaled jpg 300x200
  // in real live thumbnail is created on the server by imagemagic or similar

  const width = 300;
  const height = 200;
  const scale = Math.min(
    width / video.value.videoWidth,
    height / video.value.videoHeight
  );
  const scaledWidth = video.value.videoWidth * scale;
  const scaledHeight = video.value.videoHeight * scale;

  canvas.value.width = scaledWidth;
  canvas.value.height = scaledHeight;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video.value, 0, 0, scaledWidth, scaledHeight);

  const capturedThumbnailImage = canvas.value.toDataURL('image/jpeg');

  // create full size jpeg image
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  canvas.value.getContext('2d')?.drawImage(video.value, 0, 0);
  const capturedImage = canvas.value.toDataURL('image/jpeg');
  const projectStore = useProjectStore();

  const project = projectStore.getCurrentProject();
  if (!project) return;

  // create frame object
  const frame = {
    image: capturedImage,
    thumbnail: capturedThumbnailImage,
    name: 'Captured Image' + captureStore.$state.frames.length,
    timecreated: new Date(),
    id: captureStore.$state.frames.length + 1,
    tags: [],
  };

  // add frame to store
  captureStore.createImage(frame, project.name);

  // Do some funky animation so the user knows a screenshot has been taken.
  // It may not be the best feedback, but it works.
  toggleOpacity();
};

const isLeftDrawerOpen = computed(() => {
  return captureStore.$state.leftDrawerOpen;
});
const toggleFrames = () => {
  captureStore.$state.leftDrawerOpen = !captureStore.$state.leftDrawerOpen;
};
onMounted(() => {
  initializeVideoPlayer();
});

// This is a simple animation to show the user that a screenshot has been taken.
let timeoutId: ReturnType<typeof setTimeout> | null = null;
const toggleOpacity = () => {
  if (video.value) {
    video.value.classList.remove('fade-in-out');
    video.value.classList.add('fade-in-out');
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      video.value && video.value.classList.remove('fade-in-out');
    }, 500);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-direction: column;
}
.container__inner {
  flex: auto;
  width: 100%;
  height: calc(100vh - 125px);
}
video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fade-in-out {
  opacity: 0.1;
  /* animation: fadeEffect 0.5s ease-in-out; */
}

@keyframes fadeEffect {
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>
