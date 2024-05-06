<template>
  <q-page class="row items-center justify-evenly">
    <video-player />
  </q-page>
</template>

<script setup lang="ts">
import VideoPlayer from '../components/StreamRecorder.vue';
defineOptions({
  name: 'ProjectViedoStream',
});
</script>
