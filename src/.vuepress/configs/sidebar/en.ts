import type { SidebarConfig } from '@vuepress/theme-default'

export const sidebarEn: SidebarConfig = {
  '/NBHub/': [
    {
      text: 'NBHub Foreword',
      link: 'ABOUT.md',
    },
    {
      text: 'Contribute to NBHub',
      link: 'Contribute.md',
    },
    // {
    //   text: 'Bohrium 使用指南',
    //   link: 'submission.md',
    // },
  ],

  '/Science/FP/DFT/': [
    {
      text: 'ABACUS',
      // link: 'DFT/',
      children: [
        'AbacusUnitTesting.md',
        'ABACUS_Quick_Start_Tutorial.md',
      ],
    },

  ],

  '/Science/FP/TB/': [

    {
      text: 'DeepTB',
      // link: 'TB/',
      children: [
        'DeepTB.md',
      ],
    },
    {
      text: 'TBPLaS',
      // link: 'TB/',
      children: [
          'TBPLaS.md',
      ],
    },

  ],

  '/Science/MD/DPMD/': [
    {
      text: '',
      // prefix: 'DPMD/',
      children: [
        "LiCl_DP_Tutorial.md",
      ],
    },

    // {
    //   text: '经典分子动力学',
    //   link: 'LAMMPS/',
    //   children: [

    //   ],
    // },

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
    "qrcode-diffusion.md",
    // {
    //   text: '密度泛函理论（DFT）',
    //   link: 'DFT/',
    //   children: [

    //   ],
    // },

    // {
    //   text: '紧束缚模型（TB）',
    //   link: 'TB/',
    //   children: [
    //       'TB/DeepTB.md',
    //       'TB/TBPLaS.md',
    //   ],
    // },
    
  ],

  '/AI/NLP/': [
    {
      text: 'ChatGPT',
      // link: 'DFT/',
      children: [
        "0_ChatGPT_Prompt_Engineering_Guide_ch.md"
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