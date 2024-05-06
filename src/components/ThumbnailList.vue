<template>
  <q-virtual-scroll
    class="q-pb-md full-height"
    :items="thumbnails"
    v-slot="{ item, index }"
  >
    <q-item :key="index" v-ripple="false">
      <thumbnail-component
        :image="item.thumbnail"
        :timecreated="item.timecreated"
        :uuid="item.uuid"
        :tags="item.tags"
        @edit="addTags(item)"
        @click="selectThumbnail(item)"
      />
    </q-item>
  </q-virtual-scroll>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ThumbnailComponent, {
  ThumbnailComponentProps,
} from './ThumbnailComponent.vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app-store';
const store = useAppStore();
const router = useRouter();
const thumbnails = ref<ThumbnailComponentProps[]>(store.$state.thumbnails);

const addTags = (thumbnail: ThumbnailComponentProps) => {
  console.log('addtags', thumbnail);
};
const selectThumbnail = (thumbnail: ThumbnailComponentProps) => {
  store.setSelectedImageById(thumbnail.uuid);
  router.push({ name: 'inspect', params: { uuid: thumbnail.uuid } });
};
</script>
<style scoped></style>
