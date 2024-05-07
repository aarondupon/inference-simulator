<!-- @vue-ignore -->
<template>
  <div>
    <q-toolbar class="bg-white q-mt-lg q-mb-sm">
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
import { TouchPinchValue, vTouchPinch } from '../directives/vTouchPinch';
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

/**
 * This component is still in beta and may not work as expected.
 * resize observer is not implemented yet.
 * it allow scalling by touch, mouseweel, menu selection, inputfield and buttons
 * it allow panning by touch and mouse
 */

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
const winW = window.innerWidth;
const winH = window.innerHeight;

function draw() {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  const img = image.value;

  canvas.value.width = winW;
  canvas.value.height = winH;

  ctx.translate(winW / 2, winH / 2);
  ctx.scale(cameraZoom.value, cameraZoom.value);
  ctx.translate(-winW / 2 + cameraOffset.x, -winH / 2 + cameraOffset.y);

  ctx.clearRect(0, 0, winW, winH);

  const scale = Math.min(
    ((canvas.value.width / img.width) * window.innerWidth) / winW,
    ((canvas.value.height / img.width) * window.innerHeight) / winH
  );
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(
    (-canvas.value.width / 2) * scale,
    (-canvas.value.height / 2) * scale,
    canvas.value.width * scale,
    canvas.value.height * scale
  );

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
  if (!cameraOffset) return;
  cameraOffset.x += (e.delta?.x || 0) / cameraZoom.value;
  cameraOffset.y += (e.delta?.y || 0) / cameraZoom.value;
};

const handePinch = (e: TouchPinchValue) => {
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
  border-radius: 16px;
  overflow: hidden;
}
</style>
