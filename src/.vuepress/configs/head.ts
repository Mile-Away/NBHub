import type { HeadConfig } from '@vuepress/core'

export const head: HeadConfig[] = [
  [
    'link',
    {
      rel: 'icon',
      type: 'image/svg',
      sizes: '16x16',
      href: `/images/icons/logo-H.svg`,
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      type: 'image/svg',
      sizes: '32x32',
      href: `/images/icons/logo-H.svg`,
    },
  ],
  [
    'link',
    {
      rel: 'icon',
      type: 'image/x-icon',
      sizes: '32x32',
      href: `/images/icons/logo-H.svg`,
    },
  ],
  // ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
  // ['meta', { name: 'application-name', content: 'Protium' }],
  // for markdown-it-Katex
  ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css' }], // 让md支持数学公式
  ['link', { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" }],  // 让md支持数学公式
  // ['meta', { name: 'apple-mobile-web-app-title', content: 'Protium' }],
  // ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  [
    'link',
    { rel: 'apple-touch-icon', href: `/images/icons/logo-H.svg` },
  ],
  [
    'link',
    {
      rel: 'mask-icon',
      href: '/images/icons/logo-H.svg',
      color: '#3eaf7c',
    },
  ],
  // ['meta', { name: 'msapplication-TileColor', content: '#3eaf7c' }],
  // ['meta', { name: 'theme-color', content: '#3eaf7c' }],
]
