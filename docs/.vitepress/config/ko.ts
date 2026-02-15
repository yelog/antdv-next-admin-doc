import { defineConfig } from 'vitepress'

export const ko = defineConfig({
  lang: 'ko-KR',
  description: 'Vue 3 + TypeScript + Ant Design Vue 기반의 현대적인 관리 시스템 스타터',

  themeConfig: {
    nav: [
      { text: '가이드', link: '/ko/guide/introduction', activeMatch: '/ko/guide/' },
      { text: '컴포넌트', link: '/ko/components/pro-table', activeMatch: '/ko/components/' },
      { text: '변경 로그', link: '/ko/changelog' },
    ],

    sidebar: {
      '/ko/guide/': [
        {
          text: '시작하기',
          items: [
            { text: '프로젝트 소개', link: '/ko/guide/introduction' },
            { text: '빠른 시작', link: '/ko/guide/getting-started' },
            { text: '프로젝트 구조', link: '/ko/guide/project-structure' },
          ],
        },
        {
          text: '핵심 기능',
          items: [
            { text: '라우팅', link: '/ko/guide/routing' },
            { text: '권한 관리', link: '/ko/guide/permission' },
            { text: '테마', link: '/ko/guide/theme' },
            { text: '국제화', link: '/ko/guide/i18n' },
            { text: 'Mock 데이터', link: '/ko/guide/mock' },
            { text: '상태 관리', link: '/ko/guide/state-management' },
          ],
        },
        {
          text: '개발 가이드',
          items: [
            { text: '개발 워크플로우', link: '/ko/guide/development-workflow' },
            { text: 'API 통합', link: '/ko/guide/api-integration' },
            { text: '유틸리티', link: '/ko/guide/utils' },
            { text: '공통 컴포넌트', link: '/ko/guide/common-components' },
            { text: 'Composables', link: '/ko/guide/composables' },
          ],
        },
        {
          text: '고급 주제',
          items: [
            { text: '탭 시스템', link: '/ko/guide/tabs' },
            { text: '레이아웃 시스템', link: '/ko/guide/layout' },
            { text: '예제 및 데모', link: '/ko/guide/examples' },
          ],
        },
        {
          text: '기타',
          items: [
            { text: '배포 가이드', link: '/ko/guide/deployment' },
            { text: 'FAQ', link: '/ko/guide/faq' },
          ],
        },
      ],
      '/ko/components/': [
        {
          text: 'Pro 컴포넌트',
          items: [
            { text: 'ProTable', link: '/ko/components/pro-table' },
            { text: 'ProForm', link: '/ko/components/pro-form' },
            { text: 'ProModal', link: '/ko/components/pro-modal' },
            { text: 'ProDescriptions', link: '/ko/components/pro-descriptions' },
            { text: 'ProStatus', link: '/ko/components/pro-status' },
            { text: 'ProChart', link: '/ko/components/pro-chart' },
            { text: 'ProUpload', link: '/ko/components/pro-upload' },
            { text: 'ProDetail', link: '/ko/components/pro-detail' },
            { text: 'ProStatCard', link: '/ko/components/pro-stat-card' },
            { text: 'ProStepForm', link: '/ko/components/pro-step-form' },
            { text: 'ProSplitLayout', link: '/ko/components/pro-split-layout' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/yelog/antdv-next-admin-doc/edit/main/docs/:path',
      text: 'GitHub에서 이 페이지 편집',
    },

    footer: {
      message: 'MIT 라이선스에 따라 배포됨',
      copyright: 'Copyright &copy; 2024-present yelog',
    },

    outline: {
      label: '페이지 탐색',
      level: [2, 3],
    },

    lastUpdated: {
      text: '마지막 업데이트',
    },

    returnToTopLabel: '맨 위로',
    sidebarMenuLabel: '메뉴',
    darkModeSwitchLabel: '테마',
    lightModeSwitchTitle: '라이트 모드로 전환',
    darkModeSwitchTitle: '다크 모드로 전환',
  },
})
