import { defineConfig } from 'vitepress'

export const shared = defineConfig({
  title: 'Antdv Next Admin',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#1677ff' }],
  ],

  themeConfig: {
    logo: {
      src: '/logo.png',
      alt: 'Antdv Next Admin',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yelog/antdv-next-admin' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close',
                },
              },
            },
          },
          ja: {
            translations: {
              button: {
                buttonText: 'ドキュメント検索',
                buttonAriaLabel: 'ドキュメント検索',
              },
              modal: {
                noResultsText: '結果が見つかりません',
                resetButtonTitle: '検索をクリア',
                footer: {
                  selectText: '選択',
                  navigateText: '切り替え',
                  closeText: '閉じる',
                },
              },
            },
          },
          ko: {
            translations: {
              button: {
                buttonText: '문서 검색',
                buttonAriaLabel: '문서 검색',
              },
              modal: {
                noResultsText: '결과를 찾을 수 없습니다',
                resetButtonTitle: '검색 초기화',
                footer: {
                  selectText: '선택',
                  navigateText: '탐색',
                  closeText: '닫기',
                },
              },
            },
          },
        },
      },
    },
  },

  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
  ],

  lastUpdated: true,
})
