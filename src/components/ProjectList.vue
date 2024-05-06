<template>
  <div class="projects fullscreen bg-blue q-pa-md flex flex-center">
    <div style="min-width: 700px; max-width: 1000px; height: 100%">
      <div class="row items-center q-pa-md full-width text-left">
        <div>Recente Projecten</div>
        <q-space />
        <q-btn
          color="primary"
          label="Nieuw project"
          icon="add"
          class="q-mt-md"
          @click="createProject"
        />
      </div>
      <div class="grid-cols items-start q-gutter-md full-width">
        <q-card
          v-for="project in projects"
          :key="project.id"
          class="my-card text-left"
          @click="openProject(project)"
        >
          <q-img
            :src="project.thumbnail"
            style="height: 120px"
            class="bg-grey-3"
          />

          <q-card-section class="q-px-sm q-pt-sm q-pb-none">
            <div class="bold">Our Changing Planet</div>
            <div
              class="row q-px-xs q-pb-xs items-center"
              style="flex-wrap: nowrap"
            >
              <q-btn
                padding="none"
                color="secondary"
                flat
                round
                icon="folder"
              />
              <div
                class="text-grey q-px-md"
                style="
                  flex-grow: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                {{ project.timeupdated }}
              </div>
              <q-btn
                dense
                padding="none"
                color="grey"
                flat
                round
                icon="delete"
                @click="removeProject(project)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <project-details v-model="promt"></project-details>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Project } from './models';
import ProjectDetails from './ProjectModalCreate.vue';
import { useProjectStore } from '../stores/project-store';
const projectStore = useProjectStore();
const promt = ref(false);

const projects = projectStore.projects;

const openProject = (project: Project) => {
  project.id && projectStore.setSelectedProject(project.id);
};

const removeProject = (project: Project) => {
  project.id && projectStore.removeProject(project.id);
};

const createProject = () => {
  promt.value = true;
};
</script>
<style scoped>
.q-card > .test {
  display: block;
  width: 100%;
  max-width: 100%;
  border: 0;
}

.grid-cols {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
</style>
