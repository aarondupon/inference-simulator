<template>
  <div
    class="container flex flex-column justify-between items-center full-width full-height"
  >
    <div class="container__inner rounded-borders q-pa-md">
      <video class="full-width full-height" ref="video" autoplay muted></video>
    </div>
    <div class="bg-white q-pb-sm q-gutter-sm rounded-borders full-width">
      <q-btn
        flat
        class="bg-primary text-white"
        @click="startPauseStream"
        :label="videoStreaming ? 'Pause' : 'Play'"
        :icon-right="videoStreaming ? 'pause' : 'play_arrow'"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../stores/app-store';
const appStore = useAppStore();
const video = ref<HTMLVideoElement | null>(null);
const videoStreaming = ref(false);

const canvas = ref<HTMLCanvasElement | null>(null);
if (!canvas.value) {
  canvas.value = document.createElement('canvas');
}

const captureCount = ref(0);

const initializeVideoPlayer = () => {
  if (!video.value) return;
  video.value.src = '/examples/video.mp4';
  video.value.volume = 0;
  video.value.load();
  video.value.play();
  appStore.startVideoStream();
  videoStreaming.value = true;
};

const startPauseStream = () => {
  if (!video.value) return;
  if (videoStreaming.value) {
    video.value.pause();
    appStore.stopVideoStream();
  } else {
    video.value.play();
    appStore.startVideoStream();
  }
  videoStreaming.value = !videoStreaming.value;
};

const captureFrame = () => {
  if (!video.value || !canvas.value) return;
  // scale to fitto 640x480
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
  // full size
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  canvas.value.getContext('2d')?.drawImage(video.value, 0, 0);
  const capturedImage = canvas.value.toDataURL('image/jpeg');

  // create model for image
  appStore.addImage({
    image: capturedImage,
    thumbnail: capturedThumbnailImage,
    title: 'Captured Image' + appStore.$state.thumbnails.length,
    timecreated: new Date(),
    uuid: `${appStore.$state.thumbnails.length}`,
    tags: [],
  });

  captureCount.value += 1;
  toggleOpacity();
};

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const toggleOpacity = () => {
  if (video.value) {
    video.value.classList.remove('fade-in-out');
    video.value.classList.add('fade-in-out');

    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      video.value && video.value.classList.remove('fade-in-out');
    }, 500);
  }
};
onMounted(() => {
  console.log(appStore.$state);
  initializeVideoPlayer();
});
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
