<template>
  <q-dialog v-model="model" position="standard">
    <q-card flat style="min-width: 400px">
      <q-card-section horizontal class="">
        <q-card-section class="col-8 card-left">
          <div>
            <div class="text-h6">Create Project</div>
            <q-input
              filled
              class="input-new-project"
              @keyup.enter="createProject"
              :error="fields.name.isError"
              :error-message="fields.name.message"
              v-model="fields.name.value"
              label="Your Project Name *"
            />
          </div>

          <div class="q-mt-md">
            <q-btn
              flat
              color="grey-6"
              class="btn-cancel"
              label="Cancel"
              v-close-popup
            />
            <q-btn
              @click="createProject"
              flat
              class="btn-save-project"
              color="primary"
              label="Save"
            ></q-btn>
          </div>
        </q-card-section>

        <q-img style="min-height: 200px" class="col-4" src="/img/project.jpg" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Project } from '../types';
import { useProjectStore } from '../stores/project.store';

const projectStore = useProjectStore();

const model = defineModel<boolean>({ default: false });

interface Field {
  name: {
    message: string;
    isError: boolean;
    value: string;
  };
}

const fields = ref<Field>({
  name: {
    message: 'Name is required',
    isError: false,
    value: '',
  },
});

const createProject = () => {
  const project = {
    name: fields.value.name.value,
    timeupdated: new Date(),
  } as Project;
  try {
    projectStore.createProject(project);
    model.value = false;
    fields.value.name.value = '';
  } catch (error) {
    fields.value.name.isError = true;
    if (error instanceof Error) {
      fields.value.name.message = error.message;
    }
  }
};
</script>
<style lang="scss">
.card-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
