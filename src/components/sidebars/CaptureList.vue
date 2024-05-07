<template>
  <q-card class="full-height rounded-borders full-width overflow-hidden">
    <q-card-section>
      <div>Captured Images</div>
    </q-card-section>
    <q-card-section class="full-width q-pa-none q-ma-none custom-height">
      <q-virtual-scroll
        class="q-pb-md full-height"
        style="height: 300px"
        :items="frames"
        v-slot="{ item, index }"
      >
        <q-item :key="index" v-ripple="false">
          <div
            class="frame full-width"
            :class="{ 'frame--selected': selectedFrameId === item.id }"
          >
            <q-img
              @click="selectThumbnail(item)"
              :src="item.image"
              alt="Image"
              class="frame__image"
            />
            <div class="frame__label">
              {{ item.timecreated }}
            </div>
          </div>
        </q-item>
      </q-virtual-scroll>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCaptureStore } from '../../stores/capture.store';
import { Frame } from '../../types';
import { date } from 'quasar';

const captureStore = useCaptureStore();
const router = useRouter();
const frames = computed<Frame[]>(() =>
  captureStore.$state.frames.map((frame) => ({
    ...frame,
    timecreated: date.formatDate(frame.timecreated, 'YYYY-MM-DD'),
  }))
);

const selectedFrameId = computed(() => captureStore.$state.selectedFrameId);

const selectThumbnail = (frame: Frame) => {
  captureStore.setSelectedFrameById(frame.id);
  router.push({ name: 'capture-detail', params: { frameId: frame.id } });
};
</script>
<style scoped>
.custom-height {
  height: calc(100% - 50px);
}

.frame {
  border-radius: 8px 8px 8px 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
}
.frame:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.frame--selected {
  border: 2px solid var(--q-primary);
}
.frame__label {
  position: absolute;
  font-size: 0.7rem;
  display: block;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: left;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px;
  padding-left: 8px;
  padding-right: 8px;
  margin: 24px;
  margin-bottom: 16px;
  width: fit-content;
  border-radius: 8px;
}
</style>
