<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div class="projects fullscreen q-pa-md flex flex-center">
      <div style="min-width: 700px; max-width: 1000px; height: 100%">
        <div
          class="row items-baseline q-py-md full-width text-left lex justify-between items-end content-center"
        >
          <div class="columns items-center q-ml-md">Recente Projecten</div>
          <q-space />
          <div>
            <q-btn
              flat
              dense
              color="secundary"
              label="New Project"
              class="btn-new-project"
              icon="add"
              @click="createProject"
            />

            <q-avatar size="28px" class="q-ml-md">
              <img src="/img/avatar.jpg" />
            </q-avatar>
          </div>
        </div>
        <div class="grid-cols items-start q-gutter-md full-width">
          <q-card
            v-for="project in projects"
            :key="project.id"
            class="my-card text-left"
            @click="openProject(project)"
          >
            <q-img
              :src="project.thumbnail || '/img/placeholder.jpg'"
              style="height: 120px"
              class="bg-grey-3"
            />

            <div class="text-bold q-pl-sm">{{ project.name }}</div>
            <div class="q-pl-sm text-primary">
              {{ getCaptureText(project) }}
            </div>
            <div
              class="row q-pl-sm"
              style="flex-wrap: nowrap; align-items: flex-end"
            >
              <div
                class="text-grey"
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
                color="grey"
                flat
                round
                icon="delete"
                @click.stop.prevent="removeProject(project)"
              />
            </div>
          </q-card>
        </div>
      </div>
    </div>
    <create-project-dialog
      v-model="showCreateProjectDialog"
    ></create-project-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Project } from '../types';
import CreateProjectDialog from '../components/CreateProjectDialog.vue';
import { useProjectStore } from '../stores/project.store';
import { date } from 'quasar';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'ProjectsPage',
});

const projectStore = useProjectStore();
const showCreateProjectDialog = ref(false);

const projects = computed(() => {
  return projectStore.$state.projects.map((project) => {
    return {
      ...project,
      thumbnail: project.frames?.[0]?.thumbnail,
      timeupdated: date.formatDate(project.timeupdated, 'YYYY-MM-DD'),
    };
  });
});

const router = useRouter();
const openProject = (project: Project) => {
  project.id && projectStore.setSelectedProject(project.id);
  router.push({ name: 'capture', params: { id: project.id } });
};

const removeProject = (project: Project) =>
  project.id && projectStore.removeProject(project.id);

const createProject = () => {
  showCreateProjectDialog.value = true;
};

const getCaptureText = (project: Project) =>
  project.frames?.length ? `${project.frames?.length} captures` : 'empty';

onMounted(async () => projectStore.fetchProjects());
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
