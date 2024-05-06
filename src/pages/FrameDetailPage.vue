<template>
  <div v-if="currentImage" class="image-carousel">
    <image-viewer
      :src="currentImage.image"
      :alt="currentImage.title"
      :description="currentImage.timecreated.toString()"
    >
      <template #toolbar>
        <div class="column q-ma-md">
          <div>{{ currentIndex }} / {{ images.length }}</div>
        </div>
        <q-btn flat round dense icon="chevron_left" @click="prevImage" />
        <q-btn flat round dense icon="chevron_right" @click="nextImage" />
      </template>
    </image-viewer>
  </div>
  <div v-else class="image-carousel" style="height: 100vh">no image</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '../stores/app-store';
import ImageViewer from '../components/ImageViewer/ImageViewer.vue';

const store = useAppStore();
const images = ref(store.$state.thumbnails);

const currentIndex = ref(0);

const currentImage = computed(() => images.value[currentIndex.value]);

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + images.value.length) % images.value.length;
  const uuid = images.value[currentIndex.value].uuid;
  store.setSelectedImageById(uuid);
}

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
  const uuid = images.value[currentIndex.value].uuid;
  store.setSelectedImageById(uuid);
}
</script>

<style scoped>
.image-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
