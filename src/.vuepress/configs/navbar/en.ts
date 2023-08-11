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
    text: "Guide",
    icon: "lightbulb",
    prefix: "/NBHub/",
    children: [
      {
        text: "Tutorial",
        link: "Tutorial/",
      },
      {
        text: "Practice",
        link: "Practice/",
      },
      {
        text: "Frontiers",
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
