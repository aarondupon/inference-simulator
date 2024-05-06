<template>
  <q-card
    class="rounded-borders full-width overflow-hidden"
    :class="[{ 'full-height': panelOpen }]"
  >
    <q-card-section @click="togglePanel" class="cursor-pointer">
      <q-icon :name="toggleIcon"></q-icon><b>Captured Images</b>
    </q-card-section>
    <q-card-section
      v-if="panelOpen"
      class="full-width q-pa-none q-ma-none custom-height"
    >
      <thumbnail-list></thumbnail-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import ThumbnailList from '../components/ThumbnailList.vue';
import { ref, computed } from 'vue';
defineOptions({
  name: 'SideBar',
});

const panelOpen = ref(true);
const toggleIcon = computed(() =>
  panelOpen.value ? 'expand_less' : 'expand_more'
);
const togglePanel = () => {
  panelOpen.value = !panelOpen.value;
};
</script>

<style scoped>
.custom-height {
  height: calc(100% - 50px);
}
</style>
