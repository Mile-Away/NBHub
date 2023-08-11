import { navbar } from "vuepress-theme-hope";

export const navbarZh = navbar([
  {
    text: "首页",
    link: "/zh/",
  },
  {
    text: "关于 NBHub",
    link: "/zh/NBHub/ABOUT.md",
  },
  {
    text: "导览",
    icon: "lightbulb",
    prefix: "/zh/NBHub/",
    children: [
      {
        text: "系列教程",
        link: "Tutorial/",
      },
      {
        text: "先进实践",
        link: "Practice/",
      },
      {
        text: "前沿知识",
        link: "Frontiers/",
      },
      // {
      //   text: "Tutorial",
      //   // icon: "lightbulb",
      //   prefix: "Tutorial/",
      //   children: [
        
      //     { 
      //       text: "TBPLaS", 
      //       // icon: "ellipsis", 
      //       link: "TBPLas.md" },

      //   ],
      // },
      // {
      //   text: "Practice",
      //   // icon: "lightbulb",
      //   prefix: "Practice/",
      //   children: [
        
      //     { 
      //       text: "当我们说起神经网络的等变性，我们在谈论什么", 
      //       // icon: "ellipsis", 
      //       link: "当我们说起神经网络的等变性，我们在谈论什么.md.md" },

      //   ],
      // },
      // {
      //   text: "Frontiers",
      //   // icon: "lightbulb",
      //   prefix: "Frontiers/",
      //   children: [
        
      //     { 
      //       text: "ChatGPT", 
      //       // icon: "ellipsis", 
      //       link: "0_ChatGPT_Prompt_Engineering_Guide_ch.md" },

      //   ],
      // },
    ],
  },
  {
    text: "Notebook ",
    icon: "book",
    link: "https://nb.bohrium.dp.tech",
  },
]);
