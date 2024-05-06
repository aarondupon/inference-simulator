<template>
  <div class="row items-center justify-evenly">
    <q-toolbar class="text-white bg-white rounded-borders q-pa-xs">
      <q-form @submit.prevent="() => {}" ref="form" class="full-width">
        <q-input
          v-model="text"
          type="text"
          dense
          outlined
          placeholder="+ Add a tag and press Enter"
          no-error-focus
          no-error-icon
          @keyup.enter="onAddTag"
          @blur="reset"
          :rules="[
            (val) => (val && val.trim().length > 0) || 'Please type something',
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['addTag', 'removeTag']);
const text = ref('');
const form = ref();

defineProps<TagManagerProps>();

interface TagManagerProps {
  tags: string[];
  addTag?: () => void;
  removeTag?: (index: number) => void;
}

const onAddTag = () => {
  form.value.validate().then((success: boolean) => {
    if (success) {
      form.value.reset();
      console.log('text', text.value);
      emit('addTag', text.value);
    }
  });
};

const onRemoveTag = (index: number) => {
  if (index !== -1) {
    emit('removeTag', index);
  }
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
</style>
