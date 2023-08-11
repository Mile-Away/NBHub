import { getDirname, path } from "@vuepress/utils";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchPlugin } from "@vuepress/plugin-search";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "NBHub",
      description: "A docs demo for vuepress-theme-hope",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "NBHub",
      description: "vuepress-theme-hope 的文档演示",
    },
  },

  theme,

  plugins: [
    searchPlugin({
      maxSuggestions: 10,
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/zh/': {
          placeholder: '搜索',
        },
      },
    }),
  ],

  // alias: {
  //   // 你可以在这里将别名定向到自己的组件
  //   // 比如这里我们将主题的主页组件改为用户 .vuepress/components 下的 HomePage.vue
  //   "@theme-hope/components/HomePage": path.resolve(
  //     __dirname,
  //     "./components/HomePage.vue",
  //   ),
  // },
  // Enable it with pwa
  // shouldPrefetch: false,
});
