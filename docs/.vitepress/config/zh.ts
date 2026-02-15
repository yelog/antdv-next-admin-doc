import { defineConfig } from 'vitepress'

export const zh = defineConfig({
  lang: 'zh-CN',
  description: '基于 Vue 3 + TypeScript + Ant Design Vue 的现代化后台管理系统脚手架',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '组件', link: '/components/pro-table', activeMatch: '/components/' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '项目介绍', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
          ],
        },
        {
          text: '核心功能',
          items: [
            { text: '路由系统', link: '/guide/routing' },
            { text: '权限系统', link: '/guide/permission' },
            { text: '主题系统', link: '/guide/theme' },
            { text: '国际化', link: '/guide/i18n' },
            { text: 'Mock 数据', link: '/guide/mock' },
          ],
        },
        {
          text: '其他',
          items: [
            { text: '部署指南', link: '/guide/deployment' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Pro 组件',
          items: [
            { text: 'ProTable 高级表格', link: '/components/pro-table' },
            { text: 'ProForm 高级表单', link: '/components/pro-form' },
            { text: 'ProModal 高级弹窗', link: '/components/pro-modal' },
            { text: 'ProDescriptions 描述列表', link: '/components/pro-descriptions' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/yelog/antdv-next-admin-doc/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright &copy; 2024-present yelog',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最后更新于',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
