export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {      
      charset: 'utf-16',           
      title: 'Abyar Sanaat',      
      meta: [              
        { name: 'description', content: '' }      
      ],
    }
  },

  runtimeConfig: {
    public: {
      env: process.env.ENVIRONMENT,
      file_urls: {
        bucketUrl: process.env.BUCKET_URL,
        bucketDomainUrl: process.env.BUCKET_DOMAIN_URL,
      },
      domain: process.env.DOMAIN_ADDRESS,
      websiteName: process.env.WEBSITE_NAME || "abyarsanat.ir",
      senderInfo: {
        postalCode: "3361362360",
        phoneNumber: "09388583972",
      },
      imageGuide: [
        {
          table_name: "homepage_carousel",
          field_name: "image_url",
          width: "2800px",
          height: "100px",
        },
        {
          table_name: "small_homepage_banner",
          field_name: "image_url",
          width: "400px",
          height: "300px",
        },
        {
          table_name: "big_homepage_banner",
          field_name: "image_url",
          width: "1400px",
          height: "600px",
        },
        {
          table_name: "info",
          field_name: "image_url",
          width: "1180px",
          height: "780px",
        },
        {
          table_name: "page",
          field_name: "image_url",
          width: "1200px",
          height: "630px",
        },
        {
          table_name: "product",
          field_name: "image_url",
          width: "1600px",
          height: "1600px",
        },
        {
          table_name: "product",
          field_name: "content",
          width: "200px",
          height: "200px",
        },
        {
          table_name: "product_category",
          field_name: "icon_url",
          width: "200px",
          height: "200px",
        },
        {
          table_name: "blog",
          field_name: "image_url",
          width: "1440px",
          height: "720px",
        },
        {
          table_name: "blog_category",
          field_name: "icon_url",
          width: "200px",
          height: "200px",
        }
      ],
      accessGroups: [
        'pageManagement',
        'blogManagement',
        'adminManagement',
        'userManagement',
        'logManagement',
        'fileManagement',
        'productManagement'
      ],
      sideLinks: [
        {
          name: "adminManagement",
          accessGroup: "adminManagement",
          path: "/dashboard/admin",
          icon: `<span class="material-icon round i-xs">admin_panel_settings</span>`,
        },
        {
          name: "pageManagement",
          accessGroup: "pageManagement",
          path: "/dashboard/pages",
          icon: `<span class="material-icon round i-xs">auto_stories</span>`,
        },
        {
          name: "blogManagement",
          accessGroup: "blogManagement",
          path: "/dashboard/blog",
          icon: `<span class="material-icon round i-xs">newspaper</span>`,
        },
        {
          name: "productManagement",
          accessGroup: "productManagement",
          path: "/dashboard/product",
          icon: `<span class="material-icon round i-xs">inventory_2</span>`,
        },
        {
          name: "userManagement",
          accessGroup: "userManagement",
          path: "/dashboard/user",
          icon: `<span class="material-icon round i-xs">person</span>`,
        },
        {
          name: "promotionManagement",
          accessGroup: "promotionManagement",
          path: "/dashboard/promotion",
          icon: `<span class="material-icon round i-xs">currency_exchange</span>`,
        },
        {
          name: "orderManagement",
          accessGroup: "orderManagement",
          path: "/dashboard/order/pre",
          icon: `<span class="material-icon round i-xs">shopping_cart</span>`,
        },
      ],
      pages: [
        {
          name: "home",
          carousel: true,
          banners: true,
          links: [
            {
              name: "specialOfferProductManagement",
              url: "/dashboard/product/special-offer",
              icon: `<span  class="material-icon i-xs round">stars</span>`
            },
            {
              name: "selectedProductBrandManagement",
              url: "/dashboard/product/brand/selected",
              icon: `<span  class="material-icon i-xs round">check_box</span>`
            }
          ],
          icon: `<span class="material-icon i-xs round">home</span>`,
        },
        {
          name: "about",
          icon: `<span class="material-icon i-xs round">info</span>`,
        },
        {
          name: "blogs",
          icon: `<span class="material-icon i-xs round">article</span>`,
        },
        {
          name: "faq",
          icon: `<span class="material-icon i-xs round">question_mark</span>`,
        },
        {
          name: "contact",
          icon: `<span class="material-icon i-xs round">call</span>`,
        },
      ],
      captchaKey: process.env.CAPTCHA_SITE_KEY ? process.env.CAPTCHA_SITE_KEY : "6Lc43xEoAAAAAGnrsjacMBv9Xw2deApBZb-NdJMn",
      baseURL: process.env.BACKEND_BASE_URL ? process.env.BACKEND_BASE_URL : 'http://localhost:8080/api/v1',
      mockData: false,
    },
  },

  modules: [// '@nuxt/image',
    '@nuxtjs/i18n', 
    '@pinia/nuxt', 
    'vue3-carousel-nuxt', 
    // process.env.ENVIRONMENT === 'production' ? 'nuxt-security' : undefined,
  ],

  carousel: {
    prefix: "Nuxt"
  },

  i18n: {
    strategy: 'prefix_and_default',
    // lazy: true,
    // langDir: './messages/index',
    defaultLocale: 'fa',
    compilation: { jit: true, strictMessage: true, escapeHtml: false },
    locales: [
      { code: "fa", iso: "fa", dir: 'rtl', displayName: "فارسی", title:"آبیار صنعت" },
      // { code: "en", iso: "en-US", dir: 'ltr', displayName: "english", title:"Abyar Sanaat" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      cookieDomain: null,
      fallbackLocale: "fa",
      redirectOn: "root"
    },
    vueI18n: './nuxt-i18n.ts'
  },

  compatibilityDate: "2024-07-25"
})