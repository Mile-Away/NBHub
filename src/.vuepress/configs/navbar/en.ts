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
            text: "Deep Potential Molecular Dynamics", 
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
            text: "QR-Code", 
            // icon: "ellipsis", 
            link: "qrcode-diffusion.md",
          },
        ],
      },
    ],
  },

  {
    text: "Tutorial",
    icon: "others",
    prefix: "/Tutorial/",
    children: [
      { 
        text: "(Preparing...)Basic", 
        // icon: "ellipsis", 
        prefix: "/",
        children: [
          {
            text: "Linux Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "Python Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "(Preparing...)Machine Learning", 
        // icon: "ellipsis", 
        prefix: "Series/",
        children: [
          {
            text: "SKLearn Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "PyTorch Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "(Preparing...)Science Computing", 
        // icon: "ellipsis", 
        prefix: "Series/",
        children: [
          {
            text: "VASP Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
          {
            text: "LAMMPS Tutorial",
            link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md",
          },
        ],
      },
      { 
        text: "Others", 
        // icon: "ellipsis", 
        prefix: "Others/",
        children: [
          {
            text: "Neural Network Equivariance",
            link: "当我们说起神经网络的等变性，我们在谈论什么.md",
          },
          

        ], 
      },

    ],
  },
]);