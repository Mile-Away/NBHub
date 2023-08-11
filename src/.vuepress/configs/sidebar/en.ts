import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/NBHub/': [
    {
      text: 'About NBHub',
      children: [
          'ABOUT.md',
      ],
    },
    {
      text: 'Tutorial',
      link: 'Tutorial/',
      // collapsible: false,
      children: [
         '/NBHub/Tutorial/TBPLaS.md',
         '/NBHub/Tutorial/LiCl_DP_Tutorial.md'
      ],
    },
    {
      text: 'Practice',
      link: 'Practice/',
      children: [
         '/NBHub/Practice/当我们说起神经网络的等变性，我们在谈论什么.md',
      ],
    },
    {
      text: 'Frontiers',
      link: 'Frontiers/',
      children: [
        '/NBHub/Frontiers/0_ChatGPT_Prompt_Engineering_Guide_ch.md',
      ]
    },
  ],
}
