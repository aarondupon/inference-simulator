<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    Recent Projects
    <project-list />
  </div>
</template>

<script setup lang="ts">
import ProjectList from '../components/ProjectList.vue';

defineOptions({
  name: 'ProjectsPage',
});
</script>
