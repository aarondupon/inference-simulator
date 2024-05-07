<template>
  <q-page class="row items-center justify-evenly">
    <stream-recorder @stop="onStopRecording" />
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import StreamRecorder from '../components/StreamRecorder.vue';
import { useProjectStore } from 'src/stores/project.store';
import { useCaptureStore } from 'src/stores/capture.store';
defineOptions({
  name: 'CapturePage',
});

const projectStore = useProjectStore();
const captureStore = useCaptureStore();

// update projectStore if  enter router

onBeforeMount(async () => {
  const route = useRoute();
  const projectId = Number(route.params.id);
  await projectStore.fetchProjects();
  await projectStore.setSelectedProject(projectId);
  const frames = projectStore.getCurrentProject()?.frames;

  if (frames) {
    captureStore.setFrames(frames);
  }
});

const onStopRecording = () => {
  const project = projectStore.getCurrentProject();
  if (project?.frames?.length) {
    captureStore.leftDrawerOpen = true;
  }
};
</script>
