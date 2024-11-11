import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/uniapp-cli/',
  title: 'CLI for uniapp',
  description: 'uniapp命令行工具',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/uniapp-cli/logo.svg',
      },
    ],
  ],
  sitemap: {
    hostname: 'https://wtto00.github.io/uniapp-cli/',
  },
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '适配', link: '/adapter/', activeMatch: '/adapter/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '简介',
          items: [
            { text: '介绍', link: 'introduction' },
            { text: '快速开始', link: 'getting-started' },
          ],
          base: '/guide/',
        },
        {
          text: '开始',
          items: [
            { text: '创建项目', link: 'create' },
            { text: '检查环境', link: 'requirement' },
          ],
          base: '/guide/',
        },
      ],
      '/adapter/': [
        {
          text: '适配',
          items: [{ text: 'uniCloud', link: '/adapter/unicloud' }],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outlineTitle: '页面导航',
    lastUpdated: { text: '上次更新' },

    socialLinks: [{ icon: 'github', link: 'https://github.com/wtto00/uniapp-cli' }],
  },
})
