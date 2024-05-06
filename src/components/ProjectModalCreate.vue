<template>
  <q-dialog v-model="model" position="standard">
    <q-card flat style="min-width: 400px">
      <q-card-section horizontal class="">
        <q-card-section class="col-8 card-left">
          <div>
            <div class="text-h6">New Project</div>
            <q-form ref="form" class="q-gutter-md q-py-sm">
              <q-input
                filled
                :error="errors.name.isError"
                :error-message="errors.name.message"
                v-model="name"
                label="Your Project Name *"
              />
            </q-form>
          </div>

          <div class="q-mt-md">
            <q-btn flat color="grey-6" label="cancel" v-close-popup />
            <q-btn
              @click="createProject"
              flat
              color="primary"
              label="Save"
            ></q-btn>
          </div>
        </q-card-section>

        <q-img
          style="min-height: 200px"
          class="col-4"
          src="https://cdn.quasar.dev/img/parallax2.jpg"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Project } from './models';
// import { useProjectStore } from '../stores/project-store';

interface ProjectDetailsProps {
  project?: Project;
}

const projectStore = ref(); //useProjectStore();
const props = defineProps<ProjectDetailsProps>();
const name = ref(props.project?.name);
const form = ref();
const model = defineModel<boolean>({ default: false });
// const rules = [(val: string) => !!val || 'Name is required'];

const errors = reactive({
  name: {
    message: 'Name is required',
    isError: false,
  },
});

const createProject = () => {
  const project = {
    name: name.value,
    timeupdated: new Date().toString(),
  } as Project;
  try {
    projectStore.value.createProject(project);
    model.value = false;
  } catch (error) {
    errors.name.isError = true;
    if (error instanceof Error) {
      errors.name.message = error.message;
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
