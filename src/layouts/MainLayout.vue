<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="toolbar bg-grey-2 text-secondary">
      <q-toolbar class="bg-white">
        <q-toolbar-title>
          <div class="row">
            <div class="text-bold q-mr-sm">Inference simulator:</div>
            {{ projectname }}
          </div>
        </q-toolbar-title>
        <q-btn @click="gotoCapture" flat label="capture"> </q-btn>
        <q-btn @click="gotoProjects" flat label="projects"> </q-btn>
        <q-avatar size="28px" class="q-ml-md">
          <img src="/img/avatar.jpg" />
        </q-avatar>
      </q-toolbar>
    </q-header>
    <q-drawer
      :show-if-above="false"
      :model-value="showLeft"
      side="left"
      class="bg-grey-2 q-pt-lg q-pa-md"
    >
      <div class="full-height q-pb-md">
        <router-view name="sidebar" />
      </div>
      <div
        class="q-mini-drawer-hide absolute text-black"
        style="top: 50%; margin-top: -16px; right: -0px"
      >
        <q-btn
          dense
          round
          unelevated
          class="bg-white"
          icon="chevron_left"
          @click="toggleLeft(false)"
        />
      </div>
    </q-drawer>
    <q-drawer
      :show-if-above="false"
      :model-value="showRight"
      side="right"
      class="bg-grey-2 q-pt-lg q-pa-md"
    >
      <router-view name="sidebar-right" />
    </q-drawer>
    <q-page-container class="q-pa-md">
      <router-view name="default" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout',
});
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCaptureStore } from '../stores/capture.store';
import { useProjectStore } from '../stores/project.store';
const captureStore = useCaptureStore();
const projectStore = useProjectStore();
const projectname = computed(() => projectStore.getCurrentProject()?.name);
const showLeft = computed(() => captureStore.leftDrawerOpen);
const showRight = computed(() => captureStore.rightDrawerOpen);
const router = useRouter();
const gotoCapture = () => {
  const project = projectStore.getCurrentProject();
  if (project) {
    captureStore.rightDrawerOpen = false;
    router.push({ name: 'capture', params: { id: project.id } });
  }
};
const gotoProjects = () => {
  router.push({ name: 'home', params: {} });
};

const toggleLeft = (show: boolean) => {
  captureStore.leftDrawerOpen = show;
};
</script>
<style lang="scss" scoped>
.toolbar {
  height: 36px;
}
</style>
