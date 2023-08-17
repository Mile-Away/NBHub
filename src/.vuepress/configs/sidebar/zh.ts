import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarZh: SidebarConfig = {
  '/zh/NBHub/': [
    {
      text: 'NBHub 创刊号',
      link: 'ABOUT.md',
    },
    {
      text: '向 NBHub 投稿',
      link: 'Contribute.md',
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

  '/zh/Science/FP/': [
    
    {
      text: '第一性原理（电子尺度）？',
      link: 'README.md',
      children: [
        'FP_introduction.md',
      ],
    },
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

  '/zh/Science/MD/': [
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

  '/zh/Science/CAX/': [
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

  '/zh/AI/CV/': [
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

  '/zh/AI/Tutorial/': [
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