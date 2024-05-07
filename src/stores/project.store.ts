import { defineStore } from 'pinia';
import { Project } from 'src/types';
import * as service from 'src/service/projects';

export type ProjectState = {
  projects: Project[];
  selectedProjectId: number | null;
};

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    selectedProjectId: null,
    projects: [],
  }),
  actions: {
    async createProject(props: Partial<Project>) {
      // validate props
      if (!props.name || props.name.trim() === '') {
        throw new Error('Name is required');
      }

      if (props.name.match(/[^a-zA-Z0-9\s]/)) {
        throw new Error('Name must be alphanumeric');
      }
      // if name exists, throw error
      if (this.$state.projects.some((project) => project.name === props.name)) {
        throw new Error('Project already exists');
      }

      // create project
      await service.createProject(props);
      this.fetchProjects();
    },
    getCurrentProject() {
      if (this.$state.selectedProjectId === null) {
        return null;
      }
      return this.getProject(this.$state.selectedProjectId);
    },
    getProject(projectId: number): Project | undefined {
      if (projectId <= -1) {
        throw new Error('Project id is invalid');
      }
      const project = this.$state.projects.find(
        (project) => project.id === projectId
      );
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    },
    updateProject(projectId: number, props: Partial<Project>): void {
      // validate props
      if (!props.name || props.name.trim() === '') {
        throw new Error('Name is required');
      }

      if (props.name.match(/[^a-zA-Z0-9\s]/)) {
        throw new Error('Name must be alphanumeric');
      }

      // find project
      const project = this.$state.projects.find(
        (project) => project.id === projectId
      );

      if (!project) {
        throw new Error('Project not found');
      }

      // update project
      project.name = props.name;
      project.timeupdated = new Date();
    },
    async removeProject(projectId: number) {
      const projectIndex = this.$state.projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex > -1) {
        // this.$state.projects.splice(projectIndex, 1);
        const name = this.$state.projects[projectIndex].name;
        service.deleteProject(name);
      }

      // if selected project is removed, reset selected project
      if (this.$state.selectedProjectId === projectId) {
        this.$state.selectedProjectId = null;
      }

      this.fetchProjects();
    },
    setSelectedProject(projectId: number) {
      if (projectId > -1) {
        this.$state.selectedProjectId = projectId;
      }
    },
    async fetchProjects() {
      this.projects = await service.fetchProjects();
    },
  },
});
