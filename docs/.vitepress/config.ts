import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/prismUI/',
  title: "PrismUI",
  description: "A framework-agnostic Glassmorphism UI Kit",
  themeConfig: {
    logo: '/logo.jpg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/index' }
    ],
    sidebar: [
      {
        text: 'Components',
        items: [
          { text: 'Form', link: '/components/form' },
          { text: 'Navigation', link: '/components/navigation' },
          { text: 'Layout', link: '/components/layout' }
        ]
      }
    ]
  }
})
