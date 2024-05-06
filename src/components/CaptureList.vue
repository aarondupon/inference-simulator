<template>
  <q-card class="full-height rounded-borders full-width overflow-hidden">
    <q-card-section>
      <div>Captured Images</div>
    </q-card-section>
    <q-card-section class="full-width q-pa-none q-ma-none custom-height">
      <q-virtual-scroll
        class="q-pb-md full-height"
        style="height: 300px"
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
    </q-card-section>
  </q-card>
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
<style scoped>
.custom-height {
  height: calc(100% - 50px);
}
</style>
