import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/NBHub/': [
    {
      text: 'NBHub 创刊号',
      link: 'ABOUT.md',
    },
    // {
    //   text: 'NBHub 投稿',
    //   link: 'submission.md',
    // },
    // {
    //   text: 'Bohrium 使用指南',
    //   link: 'submission.md',
    // },
  ],

  '/Science/FP/': [
    {
      text: '密度泛函理论（DFT）',
      link: 'DFT/',
      children: [

      ],
    },

    {
      text: '紧束缚模型（TB）',
      link: 'TB/',
      children: [
          'TB/DeepTB.md',
          'TB/TBPLaS.md',
      ],
    },

  ],

  '/Science/MD/': [
    {
      text: '深度势能分子动力学',
      link: 'DPMD/',
      children: [
        "DPMD/LiCl_DP_Tutorial.md",
      ],
    },

    {
      text: '经典分子动力学',
      link: 'LAMMPS/',
      children: [

      ],
    },

  ],

  '/Science/CAX/': [
    {
      text: '密度泛函理论（DFT）',
      link: 'DFT/',
      children: [

      ],
    },

    {
      text: '紧束缚模型（TB）',
      link: 'TB/',
      children: [
          'TB/DeepTB.md',
          'TB/TBPLaS.md',
      ],
    },

  ],

  '/AI/CV/': [
    {
      text: '密度泛函理论（DFT）',
      link: 'DFT/',
      children: [

      ],
    },

    {
      text: '紧束缚模型（TB）',
      link: 'TB/',
      children: [
          'TB/DeepTB.md',
          'TB/TBPLaS.md',
      ],
    },
    
  ],

  '/AI/Tutorial/': [
    {
      text: '神经网络等变性',
      // link: 'DFT/',
      children: [
        "当我们说起神经网络的等变性，我们在谈论什么.md"
      ],
    },

    // {
    //   text: '紧束缚模型（TB）',
    //   link: 'TB/',
    //   children: [
    //       'TB/DeepTB.md',
    //       'TB/TBPLaS.md',
    //   ],
    // },
    
  ],
}