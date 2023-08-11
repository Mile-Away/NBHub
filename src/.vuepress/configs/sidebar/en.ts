import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/NBHub/': [
    {
      text: 'NBHub 创刊号',
      children: [
          'ABOUT.md',
      ],
    },
    {
      text: '系列教程',
      link: 'Tutorial/',
      collapsible: false,
      children: [
         '/NBHub/Tutorial/TBPLaS.md',
         
      ],
    },
    {
      text: '先进实践',
      link: '/NBHub/Practice/',
      children: [
         '/NBHub/Practice/当我们说起神经网络的等变性，我们在谈论什么.md',
      ],
    },
    {
      text: '前沿知识',
      link: '/NBHub/Frontiers/',
      children: [
        '/NBHub/Frontiers/0_ChatGPT_Prompt_Engineering_Guide_ch.md',
      ]
    },
  ],
}
