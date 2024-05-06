import { defineStore } from 'pinia';
import { Project } from 'src/components/models';

export type ProjectState = {
  projects: Project[];
  selectedProjectId: number | null;
};

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    selectedProjectId: null,
    projects: [
      {
        id: 1,
        name: 'Our Changing Planet',
        thumbnail: 'https://cdn.quasar.dev/img/parallax2.jpg',
        timeupdated: new Date().toString(),
        timecreated: new Date().toString(),
      },
      {
        id: 2,
        name: 'Unseen Beauty',
        thumbnail: 'https://cdn.quasar.dev/img/parallax1.jpg',
        timeupdated: new Date().toString(),
        timecreated: new Date().toString(),
      },
      {
        id: 3,
        name: 'The Secret World of Plants',
        thumbnail: 'https://cdn.quasar.dev/img/parallax3.jpg',
        timeupdated: new Date().toString(),
        timecreated: new Date().toString(),
      },
    ],
  }),
  actions: {
    createProject(props: Partial<Project>): void {
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
      const project = {
        id: this.$state.projects.length + 1,
        timeupdated: new Date().toString(),
        timecreated: new Date().toString(),
        ...props,
      } as Project;
      this.$state.projects.push(project);
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
      project.thumbnail = props.thumbnail;
      project.timeupdated = new Date().toString();
    },
    removeProject(projectId: number) {
      const projectIndex = this.$state.projects.findIndex(
        (project) => project.id === projectId
      );

      if (projectIndex > -1) {
        this.$state.projects.splice(projectIndex, 1);
      }
    },
    setSelectedProject(projectId: number) {
      if (projectId > -1) {
        this.$state.selectedProjectId = projectId;
        this.router.push({ path: `/project/${projectId}` });
        /** looks like it has a bug, does not load children if router push is used */
        // this.router.push({ name: 'project', params: { id: projectId } });
      }
    },
  },
});
