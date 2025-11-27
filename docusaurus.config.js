// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'THIZ.js',
  tagline: 'A lightweight backend DX framework',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'santhosh-2504',
  projectName: 'create-thiz-app',

  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/santhosh-2504/create-thiz-app/tree/main/docs/',
        },
        blog: false,   // 🔥 Hides blog entirely
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themes: [
    // 🔍 Enable local search
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      }
    ]
  ],

  themeConfig:
    ({
      navbar: {
        title: 'THIZ.js',
        // logo: {
        //   alt: 'THIZ.js Logo',
        //   src: 'img/logo.svg', // change later
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/santhosh-2504/create-thiz-app',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://www.linkedin.com/in/santhosh-anantha58/',
            label: 'LinkedIn',
            position: 'right',
          },
        ],
      },
      announcementBar: {
  id: 'new_release',
  content: '⭐ THIZ.js v2.4.1 is now live! Star on GitHub!',
  backgroundColor: '#0d47a1',
  textColor: '#fff',
  isCloseable: true,
},


      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/santhosh-2504/create-thiz-app',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/santhosh-anantha58/',
              },
            ],
          },
        ],
        copyright: `MIT © ${new Date().getFullYear()} THIZ.js`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;