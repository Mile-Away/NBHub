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
        text: "第一性原理（电子尺度）",
        // icon: "lightbulb",
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
            text: "深度势能分子动力学", 
            link: "DPMD/" 
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
        text: "教程", 
        link: "Tutorial/",
      },
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
    text: "更多工具",
    icon: "others",
    prefix: "zh/Others/",
    children: [
      { 
        text: "Python 基础", 
        // icon: "ellipsis", 
        link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md" 
      },

    ],
  },
]);
