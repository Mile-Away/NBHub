import { navbar } from "vuepress-theme-hope";

export const navbarZh = navbar([
  {
    text: "首页",
    link: "/zh/",
  },
  {
    text: "关于",
    link: "/zh/NBHub/ABOUT.md",
  },
  {
    text: "科学计算",
    icon: "function",
    prefix: "/zh/Science/",
    children: [
      {
        text: "？第一性原理（电子尺度）",
        // link: "FP/",
        prefix: "FP/",
        children: [
          { 
            text: "DFT｜密度泛函理论", 
            // icon: "ellipsis", 
            link: "DFT/" 
          },
          { 
            text: "TB｜紧束缚模型", 
            // icon: "ellipsis", 
            link: "TB/" 
          },

        ],
      },
      {
        text: "分子动力学（分子尺度）",
        // icon: "lightbulb",
        prefix: "MD/",
        children: [
        
          { 
            text: "DPMD｜深度势能分子动力学", 
            link: "DPMD/" 
          },
          { 
            text: "AIMD｜从头算分子动力学", 
            // icon: "ellipsis", 
            link: "TB/" 
          },
          { 
            text: "CMD｜经典分子动力学", 
            // icon: "ellipsis", 
            link: "TB/" 
          },

        ],
      },

      {
        text: "宏观仿真设计（宏观尺度）",
        // icon: "lightbulb",
        prefix: "CAX/",
        children: [
        
          { 
            text: "", 
            icon: "underscore", 
            link: "" 
          },

        ],
      },
    ]
  },
  
  {
    text: "人工智能",
    icon: "react",
    prefix: "/zh/AI/",
    children: [
      { 
        text: "自然语言处理", 
        prefix: "NLP/",
        children: [
          { 
            text: "ChatGPT", 
            // icon: "ellipsis", 
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "计算机视觉", 
        prefix: "CV/",
        children: [
          { 
            text: "Stable Diffusion", 
            // icon: "ellipsis", 
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
    ],
  },

  {
    text: "系列教程",
    icon: "others",
    prefix: "/zh/Tutorial/",
    children: [
      { 
        text: "基础教程", 
        // icon: "ellipsis", 
        prefix: "/",
        children: [
          {
            text: "Linux 基础教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "Python 基础教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "机器学习教程", 
        // icon: "ellipsis", 
        prefix: "Series/",
        children: [
          {
            text: "SKLearn 教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "PyTorch 教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "科学计算教程", 
        // icon: "ellipsis", 
        prefix: "Series/",
        children: [
          {
            text: "VASP 教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "LAMMPS 教程",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "更多", 
        // icon: "ellipsis", 
        prefix: "Others/",
        children: [
          "当我们说起神经网络的等变性，我们在谈论什么.md",

        ], 
      },

    ],
  },
  // {
  //   text: "在线运行",
  //   icon: "edit",
  //   link: "https://nb.bohrium.dp.tech",
  // }
]);
