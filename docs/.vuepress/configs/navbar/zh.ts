import type { NavbarConfig } from '@vuepress/theme-default'
// import { version } from '../meta.js'

export const navbarZh: NavbarConfig =  [
    // NavbarItem
    // NavbarGroup
    {
      text: 'NBHub 创刊号',
      link: '/NBHub/',
    },
    {
      text: '内容一览',
      children: [

        {
          text: 'NBHub 微信公众号',
          link: '/NBHub/',
          children: [
              {
              text: '系列教程',
              link: '/NBHub/Tutorial/',
              },
              {
              text: '先进实践',
              link: '/NBHub/Practice/',
              },
              {
              text: '前沿知识',
              link: '/NBHub/Frontiers/',
              },
          ]
        },

        {
          text: 'Notebook',
          // link: 'https://nb.bohrium.dp.tech',
          children: [
              {
              text: '可在线运行的交互式编程环境',
              link: 'https://nb.bohrium.dp.tech',
              }
          ]
        },

        {
          text: '其它工具',
          link: '/Toolkit/',
          children: [
              {
              text: '准备中……',
              link: '/Toolkit/prepare',
              },
          ]
        },

      ], 
    },
    {
      text: '研究方向',
      children: [
        {
          text: '科学计算',
          link: '/bar/',
          children: [
            {
              text: 'VASP 输入参数详解',
              link: '/bar/',
            },
            {
              text: 'VASP 上手教程',
              link: '/bar/',
            },
          ]
        },
        {
          text: '人工智能',
          link: '/bar/',
          children: [
            {
              text: 'LAMMPS',
              link: '/bar/',
            }
          ]
        },
        ], 
    },

  ]