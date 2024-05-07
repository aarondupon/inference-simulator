<template>
  <div v-if="currentImage" class="image-carousel">
    <image-viewer
      :src="currentImage.image"
      :alt="currentImage.name"
      :description="currentImage.timecreated.toString()"
    >
      <template #toolbar>
        <q-btn
          flat
          dens
          :label="isRightDrawerOpen ? 'Hide Tags' : 'Edit tags'"
          @click="toggleTags"
        />
        <q-btn
          flat
          dense
          :label="isLeftDrawerOpen ? 'Hide Frames' : 'Show Frames'"
          @click="toggleFrames"
        />
        <div class="column q-ma-md">
          <div>{{ currentIndex + 1 }} / {{ frames.length }}</div>
        </div>
        <q-btn flat round dense icon="chevron_left" @click="prevImage" />
        <q-btn flat round dense icon="chevron_right" @click="nextImage" />
      </template>
    </image-viewer>
  </div>
  <div v-else class="image-carousel" style="height: 100vh">no image</div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import { useProjectStore } from 'src/stores/project.store';
import { useCaptureStore } from 'src/stores/capture.store';
import ImageViewer from '../components/ImageViewer.vue';

const captureStore = useCaptureStore();
const projectStore = useProjectStore();

// nav
const currentIndex = ref(() => captureStore.$state.selectedFrameId);
watchEffect(() => {
  currentIndex.value = captureStore.$state.frames.findIndex(
    (frame) => frame.id === captureStore.$state.selectedFrameId
  );
});

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + frames.value.length) % frames.value.length;
  const frameId = frames.value[currentIndex.value].id;
  frameId && captureStore.setSelectedFrameById(frameId);
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % frames.value.length;
  const frameId = frames.value[currentIndex.value].id;
  frameId && aptureStore.setSelectedFrameById(frameId);
}

// frames
const frames = computed(() => captureStore.$state.frames);
const currentImage = computed(() => {
  const frameId = currentIndex.value;
  console.log(frameId);
  const frame = frames.value[frameId];
  if (!frame) return null;
  const timecreated = date.formatDate(frame.timecreated, 'YYYY-MM-DD');
  return {
    ...frames.value[currentIndex.value],
    timecreated: timecreated,
  };
});

// load on refresh page
onBeforeMount(async () => {
  const route = useRoute();

  const projectId = Number(route.params.id);
  await projectStore.fetchProjects();
  await projectStore.setSelectedProject(projectId);

  await projectStore.setSelectedProject(projectId);
  const frames = projectStore.getCurrentProject()?.frames;
  if (frames) {
    const frameId = Number(route.params.frameId);
    captureStore.setFrames(frames);
    frameId && captureStore.setSelectedFrameById(frameId);
    currentIndex.value = frames.findIndex((frame) => frame.id === frameId);
  }
});

const isLeftDrawerOpen = computed(() => {
  return captureStore.$state.leftDrawerOpen;
});
const isRightDrawerOpen = computed(() => {
  return captureStore.$state.rightDrawerOpen;
});
const toggleFrames = () => {
  captureStore.$state.leftDrawerOpen = !captureStore.$state.leftDrawerOpen;
};
const toggleTags = () => {
  captureStore.$state.rightDrawerOpen = !captureStore.$state.rightDrawerOpen;
};
</script>

<style scoped>
.image-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
