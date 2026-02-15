import { defineConfig } from 'vitepress'

export const ja = defineConfig({
  lang: 'ja-JP',
  description: 'Vue 3 + TypeScript + Ant Design Vue に基づくモダンな管理システムスターター',

  themeConfig: {
    nav: [
      { text: 'ガイド', link: '/ja/guide/introduction', activeMatch: '/ja/guide/' },
      { text: 'コンポーネント', link: '/ja/components/pro-table', activeMatch: '/ja/components/' },
      { text: '変更履歴', link: '/ja/changelog' },
    ],

    sidebar: {
      '/ja/guide/': [
        {
          text: 'はじめに',
          items: [
            { text: 'プロジェクト紹介', link: '/ja/guide/introduction' },
            { text: 'クイックスタート', link: '/ja/guide/getting-started' },
            { text: 'プロジェクト構造', link: '/ja/guide/project-structure' },
          ],
        },
        {
          text: 'コア機能',
          items: [
            { text: 'ルーティング', link: '/ja/guide/routing' },
            { text: '権限管理', link: '/ja/guide/permission' },
            { text: 'テーマ', link: '/ja/guide/theme' },
            { text: '国際化', link: '/ja/guide/i18n' },
            { text: 'Mockデータ', link: '/ja/guide/mock' },
            { text: '状態管理', link: '/ja/guide/state-management' },
          ],
        },
        {
          text: '開発ガイド',
          items: [
            { text: '開発ワークフロー', link: '/ja/guide/development-workflow' },
            { text: 'API統合', link: '/ja/guide/api-integration' },
            { text: 'ユーティリティ', link: '/ja/guide/utils' },
            { text: '共通コンポーネント', link: '/ja/guide/common-components' },
            { text: 'Composables', link: '/ja/guide/composables' },
          ],
        },
        {
          text: '高度なトピック',
          items: [
            { text: 'タブシステム', link: '/ja/guide/tabs' },
            { text: 'レイアウトシステム', link: '/ja/guide/layout' },
            { text: '実例とデモ', link: '/ja/guide/examples' },
          ],
        },
        {
          text: 'その他',
          items: [
            { text: 'デプロイガイド', link: '/ja/guide/deployment' },
            { text: 'FAQ', link: '/ja/guide/faq' },
          ],
        },
      ],
      '/ja/components/': [
        {
          text: 'Proコンポーネント',
          items: [
            { text: 'ProTable', link: '/ja/components/pro-table' },
            { text: 'ProForm', link: '/ja/components/pro-form' },
            { text: 'ProModal', link: '/ja/components/pro-modal' },
            { text: 'ProDescriptions', link: '/ja/components/pro-descriptions' },
            { text: 'ProStatus', link: '/ja/components/pro-status' },
            { text: 'ProChart', link: '/ja/components/pro-chart' },
            { text: 'ProUpload', link: '/ja/components/pro-upload' },
            { text: 'ProDetail', link: '/ja/components/pro-detail' },
            { text: 'ProStatCard', link: '/ja/components/pro-stat-card' },
            { text: 'ProStepForm', link: '/ja/components/pro-step-form' },
            { text: 'ProSplitLayout', link: '/ja/components/pro-split-layout' },
          ],
        },
      ],
    },

    editLink: {
      pattern: 'https://github.com/yelog/antdv-next-admin-doc/edit/main/docs/:path',
      text: 'GitHubでこのページを編集',
    },

    footer: {
      message: 'MITライセンスの下で公開されています',
      copyright: 'Copyright &copy; 2024-present yelog',
    },

    outline: {
      label: 'ページナビゲーション',
      level: [2, 3],
    },

    lastUpdated: {
      text: '最終更新日',
    },

    returnToTopLabel: 'トップに戻る',
    sidebarMenuLabel: 'メニュー',
    darkModeSwitchLabel: 'テーマ',
    lightModeSwitchTitle: 'ライトモードに切り替え',
    darkModeSwitchTitle: 'ダークモードに切り替え',
  },
})
