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
            { text: '状态管理', link: '/guide/state-management' },
          ],
        },
        {
          text: '开发指南',
          items: [
            { text: '开发工作流', link: '/guide/development-workflow' },
            { text: 'API 集成', link: '/guide/api-integration' },
            { text: '工具函数', link: '/guide/utils' },
            { text: '通用组件', link: '/guide/common-components' },
            { text: 'Composables', link: '/guide/composables' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: '多标签页', link: '/guide/tabs' },
            { text: '布局系统', link: '/guide/layout' },
            { text: '示例与实战', link: '/guide/examples' },
          ],
        },
        {
          text: '脚手架专题',
          items: [
            { text: '高级表格脚手架', link: '/guide/scaffold-pro-table-advanced' },
            { text: '复杂表单脚手架', link: '/guide/scaffold-complex-form' },
            { text: '主从详情脚手架', link: '/guide/scaffold-master-detail' },
          ],
        },
        {
          text: '业务脚手架',
          items: [
            { text: '文件上传系统脚手架', link: '/guide/scaffold-upload-system' },
            { text: '状态缓存脚手架', link: '/guide/scaffold-state-cache' },
          ],
        },
        {
          text: '系统模块',
          items: [
            { text: '用户管理', link: '/guide/system-user' },
            { text: '角色管理', link: '/guide/system-role' },
            { text: '权限管理', link: '/guide/system-permission' },
            { text: '部门管理', link: '/guide/system-dept' },
            { text: '字典管理', link: '/guide/system-dict' },
            { text: '系统配置', link: '/guide/system-config' },
            { text: '文件管理', link: '/guide/system-file' },
            { text: '日志管理', link: '/guide/system-log' },
          ],
        },
        {
          text: '安全工程',
          items: [
            { text: '请求鉴权与自动刷新', link: '/guide/security-request-auth' },
            { text: 'RBAC 权限流实战', link: '/guide/security-rbac-flow' },
          ],
        },
        {
          text: '工程质量',
          items: [
            { text: '测试体系', link: '/guide/testing' },
            { text: '可观测性实践', link: '/guide/observability' },
          ],
        },
        {
          text: '其他',
          items: [
            { text: '部署指南', link: '/guide/deployment' },
            { text: 'FAQ', link: '/guide/faq' },
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
            { text: 'ProStatus 状态指示器', link: '/components/pro-status' },
            { text: 'ProChart 图表卡片', link: '/components/pro-chart' },
            { text: 'ProUpload 上传组件', link: '/components/pro-upload' },
            { text: 'ProDetail 详情页', link: '/components/pro-detail' },
            { text: 'ProStatCard 统计卡片', link: '/components/pro-stat-card' },
            { text: 'ProStepForm 步骤表单', link: '/components/pro-step-form' },
            { text: 'ProSplitLayout 分栏布局', link: '/components/pro-split-layout' },
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
