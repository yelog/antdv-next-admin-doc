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
          ],
        },
        {
          text: 'Other',
          items: [
            { text: 'Deployment', link: '/en/guide/deployment' },
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
