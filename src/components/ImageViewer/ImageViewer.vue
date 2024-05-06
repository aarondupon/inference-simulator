<!-- @vue-ignore -->
<template>
  <div>
    <q-toolbar class="bg-white q-mb-sm">
      <q-btn
        flat
        round
        dense
        padding="xs"
        icon="zoom_in"
        @click="zoom(cameraZoom + 0.2)"
      />
      <q-btn
        flat
        round
        dense
        padding="xs"
        icon="zoom_out"
        @click="zoom(cameraZoom - 0.2)"
      />
      <q-btn-dropdown stretch flat :label="`${cameraZoomScaled}%`">
        <q-list padding style="min-width: 200px">
          <q-item>
            <q-input
              v-model="cameraZoomScaled"
              class="full-width"
              filled
              type="number"
              min="0"
              max="1000"
              step="1"
              dense
              outlined
              @input="zoom(cameraZoomScaled)"
            >
              <template #append>
                <q-item-label caption>%</q-item-label>
              </template>
            </q-input>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>Zoom to fit</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="n in [0.5, 1, 2]"
            :key="`x.${n}`"
            clickable
            v-close-popup
            tabindex="0"
            @click="zoom(n)"
          >
            <q-item-section>
              <q-item-label>Zoom {{ n * 100 }}%</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-space />
      <slot name="toolbar"></slot>
    </q-toolbar>

    <canvas
      v-touch-pinch.wheel="handePinch"
      v-touch-pan.prevent.mouse="handlePan"
      ref="canvas"
    />
    <q-card
      flat
      bordered
      class="q-ma-md"
      style="
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        width: 200px;
        bottom: 0px;
        right: 0px;
        position: fixed;
      "
    >
      <q-card-section class="column no-wrap">
        <div class="bold">{{ alt }}</div>
        <div class="text-caption">{{ description }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { TouchPanValue } from 'quasar';
import { TouchPinchValue, vTouchPinch } from './vTouchPinch';
const canvas = ref<HTMLCanvasElement>();

export interface Image {
  src: string;
  alt?: string;
  description?: string;
  width?: number;
  height?: number;
}

const props = defineProps<Image>();

const image = ref<HTMLImageElement>(new Image());

watch(
  () => props.src,
  (newSrc) => {
    image.value.src = newSrc;
  },
  { immediate: true }
);

const cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const cameraZoom = ref(1);
const cameraZoomScaled = computed({
  get: () => Math.round(cameraZoom.value * 100),
  set: (value) => {
    cameraZoom.value = value / 100;
  },
});
const zoom = (value: number) => {
  const newZoom: number = value;
  cameraZoom.value = newZoom;
};

function draw() {
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  const img = image.value;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  ctx.scale(cameraZoom.value, cameraZoom.value);
  ctx.translate(
    -window.innerWidth / 2 + cameraOffset.x,
    -window.innerHeight / 2 + cameraOffset.y
  );

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const scale = Math.min(
    canvas.value.width / img.width,
    canvas.value.height / img.width
  );
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  ctx.drawImage(
    img,
    -scaledWidth / 2,
    -scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );
  requestAnimationFrame(draw);
}

onMounted(() => {
  if (!canvas.value) return;
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  draw();
});

const handlePan: TouchPanValue = (e) => {
  console.log('panning', e);
  if (!cameraOffset) return;
  cameraOffset.x += (e.delta?.x || 0) / cameraZoom.value;
  cameraOffset.y += (e.delta?.y || 0) / cameraZoom.value;
};

const handePinch = (e: TouchPinchValue) => {
  console.log('pinching', e);
  cameraOffset.x += e.delta?.x || 0;
  cameraOffset.y += e.delta?.y || 0;
  cameraZoom.value = e.zoom;
};
</script>

<style>
canvas {
  flex: auto;
  width: 100%;
  /* height: 100%; */
  height: calc(100vh - 125px);
}
</style>
