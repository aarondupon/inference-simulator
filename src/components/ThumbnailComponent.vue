<template>
  <div
    class="thumbnail-component relative-position full-width full-height"
    @mouseenter.prevent="hover = true"
    @mouseleave.prevent="hover = false"
    :class="{ 'thumbnail-component--is-hover': hover }"
  >
    <q-img
      :src="image"
      alt="thumbnail-component Image"
      class="thumbnail-component__image rounded-borders"
    >
    </q-img>
    <div
      class="absolute-bottom-right text-subtitle2 text-white q-pa-xs q-ma-xs rounded-borders transparent-background"
    >
      {{ formattedTimeCreated }}
    </div>
    <div
      @click.prevent="onEdit"
      v-if="hover"
      class="absolute-top-left text-subtitle2 text-white q-pa-xs q-ma-xs rounded-borders transparent-background"
    >
      <q-icon name="fa-solid fa-tags"></q-icon>
    </div>
    <div
      v-if="hover"
      class="thumbnail-component__overlay absolute-center transparent q-pa-sm"
    >
      <q-btn
        flat
        class="bg-primary text-white"
        label="view"
        icon-right="camera_alt"
      >
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
export interface ThumbnailComponentProps {
  uuid: string;
  tags: string[];
  image?: string;
  thumbnail?: string;
  title?: string;
  timecreated?: Date;
  description?: string;
}

const props = withDefaults(defineProps<ThumbnailComponentProps>(), {
  title: () => 'Title',
  description: () => 'Description',
});

const emit = defineEmits(['edit']);

const onEdit = () => {
  emit('edit', props.uuid);
};

const hover = ref(false);

const formattedTimeCreated = computed(() => {
  if (!props.timecreated) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return props.timecreated.toLocaleString(undefined, options);
});
</script>
<style lang="scss" scoped>
.transparent-background {
  background-color: rgba(0, 0, 0, 0.5);
}

.thumbnail-component {
  &__image {
    border: solid 1px transparent;
  }
  &--is-hover {
    .thumbnail-component__image {
      border: solid 1px var(--q-primary);
    }
  }
}
</style>
