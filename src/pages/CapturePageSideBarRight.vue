<template>
  <q-card
    class="rounded-borders full-width overflow-hidden"
    :class="[{ 'full-height': panelOpen }]"
  >
    <q-card-section @click="togglePanel" class="cursor-pointer">
      <q-icon :name="toggleIcon"></q-icon><b>Tags</b>
    </q-card-section>
    <q-card-section
      v-if="panelOpen"
      class="full-width q-pa-none q-ma-none custom-height"
    >
      <tag-manager
        :tags="tags"
        @add-tag="
          store.addTag(String($router.currentRoute.value.params.uuid), $event)
        "
        @remove-tag="
          store.removeTag(
            String($router.currentRoute.value.params.uuid),
            $event
          )
        "
      ></tag-manager>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import TagManager from '../components/TagManager.vue';
import { useAppStore } from '../stores/app-store';
// import { useRoute } from 'vue-router';

const store = useAppStore();
defineOptions({
  name: 'SideBar',
});

// const route = useRoute();
const tags = computed(() => {
  if (!store.$state.selectedImageId) return [];
  return store.getTags(store.$state.selectedImageId);
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
