import { navbar } from "vuepress-theme-hope";

export const navbarEn = navbar([
  {
    text: "Home",
    link: "/",
  },
  {
    text: "About",
    link: "/NBHub/ABOUT.md",
  },
  {
    text: "Science",
    icon: "function",
    prefix: "/Science/",
    children: [
      {
        text: "Nano-Scale",
        // icon: "lightbulb",
        prefix: "FP/",
        children: [
          { 
            text: "Density Fuctional Theory", 
            // icon: "ellipsis", 
            link: "DFT/" 
          },
          { 
            text: "TB", 
            // icon: "ellipsis", 
            link: "TB/" 
          },

        ],
      },
      {
        text: "Molucar-Scale",
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
        text: "Macro-Scale",
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
    text: "AI",
    icon: "react",
    prefix: "/AI/",
    children: [
      { 
        text: "Tutorial", 
        link: "Tutorial/",
      },
      { 
        text: "NLP", 
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
        text: "CV", 
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
    text: "Others",
    icon: "others",
    prefix: "/Others/",
    children: [
      { 
        text: "Python 基础", 
        // icon: "ellipsis", 
        link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md" 
      },

    ],
  },
]);