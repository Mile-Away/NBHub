import { hopeTheme } from "vuepress-theme-hope";
import { defaultTheme } from "vuepress";
import { navbarEn, navbarZh } from "./configs/navbar/index.js";
import { sidebarEn, sidebarZh } from "./configs/sidebar/index.js";

export default hopeTheme({
  hostname: "",

  author: {
    name: "NBHub",
    url: "https://nbhub.tech",
  },

  iconAssets: "fontawesome-with-brands",

  logo: "/logo-2.svg",

  repo: "Q-Query/NBHub",

  docsDir: "src",

  locales: {
    "/": {
      // navbar
      navbar: navbarEn,

      // sidebar
      sidebar: sidebarEn,

      footer: "",

      displayFooter: true,
 

      metaLocales: {
        editLink: "Edit this page on GitHub",
        contributors: "Contributors",
        lastUpdated: "Last Updated",
      },
    },

    /**
     * Chinese locale config
     */
    "/zh/": {
      // navbar
      navbar: navbarZh,

      // sidebar
      sidebar: sidebarZh,

      footer: "",

      displayFooter: true,

      // page meta
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
        contributors: "贡献者",
        lastUpdated: "上次更新",
      },
    },
  },

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
      "/zh/demo/encrypt.html": ["1234"],
    },
  },

  // enable darkmode
  darkmode: "toggle",

  // pure mode
  // pure: true,

  plugins: {
    // You should generate and use your own comment service
    comment: {
      provider: "Giscus",
      repo: "Q-Query/NBHub",
      repoId: "R_kgDOKEoVLQ",
      category: "Announcements",
      categoryId: "DIC_kwDOKEoVLc4CYh_D",
    },

    // turn off default catalog 
    autoCatalog: false,

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: false,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: ["highlight", "math", "search", "notes", "zoom"],
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: false,
    },
    
    git: true,
    
    readingTime: {
      wordPerMinute: 200,
    },
    // uncomment these if you want a pwa
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },

},

{custom: true},

);
