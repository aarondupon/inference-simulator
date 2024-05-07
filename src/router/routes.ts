import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('src/pages/Projects.vue'),
  },
  {
    path: '/projects/:id',
    name: 'projects',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: '',
        name: 'capture',
        components: {
          default: () => import('src/pages/Capture.vue'),
          sidebar: () => import('src/components/sidebars/CaptureList.vue'),
        },
      },
      {
        path: 'capture-detail/:frameId',
        name: 'capture-detail',
        components: {
          default: () => import('src/pages/CaptureDetail.vue'),
          sidebar: () => import('src/components/sidebars/CaptureList.vue'),
          'sidebar-right': () =>
            import('src/components/sidebars/TagManager.vue'),
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/404.vue'),
  },
];

export default routes;
