import { defineUserConfig } from '@vuepress/cli'
import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from '@vuepress/utils'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { searchPlugin } from '@vuepress/plugin-search'
import { head, sidebarZh, sidebarEn, navbarZh, navbarEn} from './configs/index.js'
// import { katex } from '@mdit/plugin-katex'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";
import { readingTimePlugin, ReadingTime } from "vuepress-plugin-reading-time2";
import { copyCodePlugin } from "vuepress-plugin-copy-code2";
import { commentPlugin } from "vuepress-plugin-comment2";

const __dirname = getDirname(import.meta.url)  // 当前文件的绝对路径
// const isProd = process.env.NODE_ENV === 'production' // 是否是生产环境

export default defineUserConfig({
  
  base: '/',

  head,

  title: 'NBHub',
  
  locales: {
    '/': {
      // selectLanguageName: 'English',
      lang: 'zh-CN',
      title: 'NBHub',
      description: 'Notebook Hub',
    },
    '/en/': {
      // selectLanguageName: 'Chinese',
      lang: 'en-US',
      title: 'NBHub',
      description: 'Notebook Hub',
    },
  },

  theme: defaultTheme({
    logo: '/images/icons/logo.svg',
    repo: 'NBHub',
    docsDir: 'docs',
  
    locales: {
      /**
       * English locale config
       *
       * As the default locale of @vuepress/theme-default is English,
       * we don't need to set all of the locale fields
       */
      '/': {
        // navbar
        navbar: navbarZh,
        selectLanguageName: '简体中文',
        selectLanguageText: '选择语言',
        selectLanguageAriaLabel: '选择语言',
        // sidebar
        sidebar: sidebarZh,
        // page meta
        editLink: false,
        // editLinkText: '在 GitHub 上编辑此页',
        lastUpdatedText: '上次更新',
        contributorsText: '贡献者',
        // // 404 page
        // notFound: [
        //   '这里什么都没有',
        //   '我们怎么到这来了？',
        //   '这是一个 404 页面',
        //   '看起来我们进入了错误的链接',
        // ],
      },

      /**
       * Chinese locale config
       */
      '/en/': {
        // navbar
        navbar: navbarEn,
        selectLanguageName: 'English',
        // selectLanguageText: '选择语言',
        // selectLanguageAriaLabel: '选择语言',
        // sidebar
        sidebar: sidebarEn,
        // page meta
        // editLinkText: '在 GitHub 上编辑此页',
        // lastUpdatedText: '上次更新',
        // contributorsText: '贡献者',
        // custom containers
        // tip: '提示',
        // warning: '注意',
        // danger: '警告',

        // backToHome: '返回首页',
        // // a11y
        // openInNewWindow: '在新窗口打开',
        // toggleColorMode: '切换颜色模式',
        // toggleSidebar: '切换侧边栏',
      },
    },

    // themePlugins: {
    //   // only enable git plugin in production mode
    //   git: isProd,
    //   // use shiki plugin in production mode instead
    //   prismjs: !isProd,
    // },

  }),


  // options for markdown-it-anchor
  // anchor: { permalink: false },
  // options for markdown-it-toc
  // toc: { includeLevel: [1, 2] },
  extendsMarkdown: md => {
    // md.use(katex)
    // md.linkify.set({ fuzzyLink: false })
  },

  extendsPage: (page) => {
    // console.log(page)
  },

  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        },
        '/en/': {
          placeholder: 'Search',
        },
      },
    }),
    mdEnhancePlugin({
      align: true,
      attrs: true,
      card: true,
      chart: true,
      codetabs: false,
      container: false,
      demo: false,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: false,
      imgLazyload: true,
      imgMark: true,
      imgSize: true,
      include: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      katex: true,
      mathjax: 
      {
        output: "chtml",
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
      vPre: false,
      vuePlayground: false,
    }),

    readingTimePlugin({
      wordPerMinute: 200,
      locales: {
        '/': {
          time: '阅读时间',
        },
        '/en/': {
          time: 'Reading Time',
        },
      },
    }),

    copyCodePlugin({
      locales: {
        "/": {
          // Override copy button label text
          copy: "复制代码",
        },

        "/en/": {
          // Complete locale config for `mm-NN` language here
          copy: "Copy",
        },
      },
    }),

    commentPlugin({
      provider: "Giscus", // Artalk | Giscus | Waline | Twikoo
      repo: "Q-Query/NBHub/", // GitHub repo
      repoId: "R_kgDOKEoVLQ", // GitHub repo id
      category: "Announcements", // issue category
      categoryId: "DIC_kwDOKEoVLc4CYh_D", // issue category id
      lazyLoading: true, // Comments lazy loading
      // 在这里放置其他选项
      // ...
    }),
  //   docsearchPlugin({
  //     appId: '34YFD9IUQ2',
  //     apiKey: '9a9058b8655746634e01071411c366b8',
  //     indexName: 'vuepress',
  //     searchParameters: {
  //       facetFilters: ['tags:v2'],
  //     },
  //     locales: {
  //       '/': {
  //         placeholder: '搜索文档',
  //         translations: {
  //           button: {
  //             buttonText: '搜索文档',
  //             buttonAriaLabel: '搜索文档',
  //           },
  //           modal: {
  //             searchBox: {
  //               resetButtonTitle: '清除查询条件',
  //               resetButtonAriaLabel: '清除查询条件',
  //               cancelButtonText: '取消',
  //               cancelButtonAriaLabel: '取消',
  //             },
  //             startScreen: {
  //               recentSearchesTitle: '搜索历史',
  //               noRecentSearchesText: '没有搜索历史',
  //               saveRecentSearchButtonTitle: '保存至搜索历史',
  //               removeRecentSearchButtonTitle: '从搜索历史中移除',
  //               favoriteSearchesTitle: '收藏',
  //               removeFavoriteSearchButtonTitle: '从收藏中移除',
  //             },
  //             errorScreen: {
  //               titleText: '无法获取结果',
  //               helpText: '你可能需要检查你的网络连接',
  //             },
  //             footer: {
  //               selectText: '选择',
  //               navigateText: '切换',
  //               closeText: '关闭',
  //               searchByText: '搜索提供者',
  //             },
  //             noResultsScreen: {
  //               noResultsText: '无法找到相关结果',
  //               suggestedQueryText: '你可以尝试查询',
  //               reportMissingResultsText: '你认为该查询应该有结果？',
  //               reportMissingResultsLinkText: '点击反馈',
  //             },
  //           },
  //         },
  //       },
  //     },
  //   }),
  ],

})

