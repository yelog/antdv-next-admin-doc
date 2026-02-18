import { defineConfig } from 'vitepress'

export const en = defineConfig({
  lang: 'en-US',
  description: 'A modern Vue 3 + TypeScript admin scaffold based on Ant Design Vue',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/en/guide/introduction', activeMatch: '/en/guide/' },
      { text: 'Components', link: '/en/components/pro-table', activeMatch: '/en/components/' },
      { text: 'Changelog', link: '/en/changelog' },
    ],

    sidebar: {
      '/en/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/en/guide/introduction' },
            { text: 'Quick Start', link: '/en/guide/getting-started' },
            { text: 'Project Structure', link: '/en/guide/project-structure' },
          ],
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Routing', link: '/en/guide/routing' },
            { text: 'Permission', link: '/en/guide/permission' },
            { text: 'Theming', link: '/en/guide/theme' },
            { text: 'Internationalization', link: '/en/guide/i18n' },
            { text: 'Mock Data', link: '/en/guide/mock' },
            { text: 'State Management', link: '/en/guide/state-management' },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'Development Workflow', link: '/en/guide/development-workflow' },
            { text: 'API Integration', link: '/en/guide/api-integration' },
            { text: 'Utils', link: '/en/guide/utils' },
            { text: 'Common Components', link: '/en/guide/common-components' },
            { text: 'Composables', link: '/en/guide/composables' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Tabs System', link: '/en/guide/tabs' },
            { text: 'Layout System', link: '/en/guide/layout' },
            { text: 'Examples', link: '/en/guide/examples' },
          ],
        },
        {
          text: 'Scaffold Guides',
          items: [
            { text: 'ProTable Advanced Scaffold', link: '/en/guide/scaffold-pro-table-advanced' },
            { text: 'Complex Form Scaffold', link: '/en/guide/scaffold-complex-form' },
            { text: 'Master Detail Scaffold', link: '/en/guide/scaffold-master-detail' },
          ],
        },
        {
          text: 'System Modules',
          items: [
            { text: 'User Management', link: '/en/guide/system-user' },
            { text: 'Role Management', link: '/en/guide/system-role' },
            { text: 'Permission Management', link: '/en/guide/system-permission' },
            { text: 'Department Management', link: '/en/guide/system-dept' },
            { text: 'Dictionary Management', link: '/en/guide/system-dict' },
            { text: 'System Configuration', link: '/en/guide/system-config' },
            { text: 'File Management', link: '/en/guide/system-file' },
            { text: 'Log Management', link: '/en/guide/system-log' },
          ],
        },
        {
          text: 'Security',
          items: [
            { text: 'Request Auth and Token Refresh', link: '/en/guide/security-request-auth' },
            { text: 'RBAC Flow in Practice', link: '/en/guide/security-rbac-flow' },
          ],
        },
        {
          text: 'Engineering Quality',
          items: [
            { text: 'Testing Strategy', link: '/en/guide/testing' },
            { text: 'Observability', link: '/en/guide/observability' },
          ],
        },
        {
          text: 'Other',
          items: [
            { text: 'Deployment', link: '/en/guide/deployment' },
            { text: 'FAQ', link: '/en/guide/faq' },
          ],
        },
      ],
      '/en/components/': [
        {
          text: 'Pro Components',
          items: [
            { text: 'ProTable', link: '/en/components/pro-table' },
            { text: 'ProForm', link: '/en/components/pro-form' },
            { text: 'ProModal', link: '/en/components/pro-modal' },
            { text: 'ProDescriptions', link: '/en/components/pro-descriptions' },
            { text: 'ProStatus', link: '/en/components/pro-status' },
            { text: 'ProChart', link: '/en/components/pro-chart' },
            { text: 'ProUpload', link: '/en/components/pro-upload' },
            { text: 'ProDetail', link: '/en/components/pro-detail' },
            { text: 'ProStatCard', link: '/en/components/pro-stat-card' },
            { text: 'ProStepForm', link: '/en/components/pro-step-form' },
            { text: 'ProSplitLayout', link: '/en/components/pro-split-layout' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/yelog/antdv-next-admin-doc/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright &copy; 2024-present yelog',
    },

    outline: {
      label: 'On This Page',
      level: [2, 3],
    },

    lastUpdated: {
      text: 'Last updated',
    },
  },
})
