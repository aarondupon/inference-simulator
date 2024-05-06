import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('src/pages/ProjectListPage.vue'),
  },
  {
    path: '/projects/:id',
    name: 'projects',
    component: () => import('layouts/MainLayout.vue'),

    children: [
      {
        path: '',
        name: 'projects-home',
        components: {
          default: () => import('src/pages/CapturePage.vue'),
          sidebar: () => import('src/components/CaptureList.vue'),
        },
      },
      {
        path: 'inspect/:uuid',
        name: 'inspect',
        components: {
          default: () => import('src/pages/FrameDetailPage.vue'),
          sidebar: () => import('src/pages/CaptureList.vue'),
          'sidebar-right': () =>
            import('src/pages/CapturePageSideBarRight.vue'),
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
