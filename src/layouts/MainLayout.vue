<template>
  <q-layout view="lHr lpR fFf">
    <q-header class="bg-grey-2 text-secondary">
      <q-toolbar>
        <q-toolbar-title>
          Inference simulator {{ store.leftDrawerOpen }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      :show-if-above="true"
      :model-value="!store.leftDrawerOpen"
      side="left"
      class="bg-grey-2 q-pa-md"
    >
      <div class="full-height q-pb-md">
        <router-view name="sidebar" />
      </div>
    </q-drawer>
    <q-drawer
      :show-if-above="true"
      :model-value="store.rightDrawerOpen"
      side="right"
      class="bg-grey-2 q-pa-md"
    >
      <router-view name="sidebar-right" />
    </q-drawer>
    <q-page-container class="q-pa-md">
      <router-view name="default" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app-store';

defineOptions({
  name: 'MainLayout',
});

const store = useAppStore();
</script>
