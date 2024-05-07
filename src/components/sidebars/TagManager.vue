<template>
  <q-card class="rounded-borders full-width overflow-hidden full-height">
    <q-card-section>
      <div>Tags</div>
    </q-card-section>
    <q-card-section class="tags full-width q-pa-none q-ma-none custom-height">
      <div class="row items-center justify-evenly tags__inner">
        <q-toolbar class="text-white bg-white rounded-borders q-pa-xs">
          <q-form @submit.prevent="() => {}" ref="form" class="full-width">
            <q-input
              v-model="text"
              class="input-tag"
              type="text"
              dense
              outlined
              placeholder="+ Add a tag and press Enter"
              no-error-focus
              no-error-icon
              @keyup.enter="onAddTag"
              @blur="reset"
              :rules="[
                (val) =>
                  (val && val.trim().length > 0) || 'Please type something',
                (val) => !tags.includes(val) || 'Tag already exists',
              ]"
            >
              <template #append>
                <q-icon @click="reset" name="clear" />
              </template>
            </q-input>
          </q-form>
        </q-toolbar>

        <div class="truncate-chip-labels">
          <q-chip
            v-for="(tag, i) in tags"
            :key="tag"
            removable
            color="secondary"
            text-color="white"
            :label="tag"
            @remove="onRemoveTag(i)"
          >
            <q-tooltip>{{ tag }}</q-tooltip>
          </q-chip>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCaptureStore } from '../../stores/capture.store';

const captureStore = useCaptureStore();
const text = ref('');
const form = ref();

const tags = computed(() => {
  if (!captureStore.$state.selectedFrameId) return [];
  return captureStore.getTags(captureStore.$state.selectedFrameId);
});

const onAddTag = () => {
  form.value.validate().then((success: boolean) => {
    if (success) {
      form.value.reset();
      captureStore.$state.selectedFrameId &&
        captureStore.addTag(captureStore.$state.selectedFrameId, text.value);
    }
  });
};

const onRemoveTag = (index: number) => {
  captureStore.$state.selectedFrameId &&
    captureStore.removeTag(captureStore.$state.selectedFrameId, index);
};

const reset = () => {
  text.value = '';
  form.value.reset();
};
</script>
<style lang="scss" scoped>
.truncate-chip-labels > .q-chip {
  max-width: 250px;
}
.custom-height {
  height: calc(100% - 50px);
}

.tags__inner {
  justify-content: flex-start;
}
</style>
