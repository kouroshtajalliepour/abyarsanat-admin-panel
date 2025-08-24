import { defineStore } from 'pinia'

import { fakeAboutData, fakeContactData, fakeSlider } from '~~/mockedData'


export const usePagesStore = defineStore('pagesStore', () => {
   const {public: {baseURL, mockData}} = useRuntimeConfig()
   const slides = ref([]) as any

   const homePageData = ref({}) as any
   const projectsPageContent = ref({}) as any

   const aboutData = ref({}) as any

   const contactData = ref({}) as any

   async function getHomePage({locale}:any) {

      try {
         if (mockData) {
            slides.value = fakeSlider
            return
         }

         let URL = `/${locale}/page/home/locale`

         const res:any = await $fetch(URL, {
               method: 'get',
               baseURL,
         })
         slides.value = res.slides
         homePageData.value = res
      } catch (error:any) {
         console.log("🚀 ~ file: pages.ts:19 ~ getSlides ~ error:", error)
      }
   }
   async function getProjectsData({locale}:any) {

      try {
         if (mockData) {
            slides.value = fakeSlider
            return
         }

         let URL = `/${locale}/page/projects/locale`

         const res:any = await $fetch(URL, {
               method: 'get',
               baseURL,
         })
         projectsPageContent.value = res
      } catch (error:any) {
         console.log("🚀 ~ file: pages.ts:19 ~ getSlides ~ error:", error)
      }
   }
   async function getContactData({locale}:any) {
      try {
         if (mockData) {
            contactData.value = fakeContactData
            return
         }

         let URL = `/${locale}/contact-page/contact/locale`

         const res:any = await $fetch(URL, {
               method: 'get',
               baseURL,
         })
         console.log("🚀 ~ file: pages.ts:69 ~ getContactData ~ res:", res)
         contactData.value = res
      } catch (error:any) {
         console.log("🚀 ~ file: pages.ts:19 ~ getSlides ~ error:", error)
      }
   }
   async function getAboutData({locale}:any) {
      try {
         if (mockData) {
            aboutData.value = fakeAboutData
            return
         }

         let URL = `/${locale}/about-page/about/locale`

         const res:any = await $fetch(URL, {
               method: 'get',
               baseURL,
         })
         aboutData.value = res
         
      } catch (error:any) {
         console.log("🚀 ~ file: pages.ts:19 ~ getSlides ~ error:", error)
      }
   }

    
    
   return {
      slides,
      aboutData,
      contactData,
      getContactData,
      projectsPageContent,
      getProjectsData,
      homePageData,
      getAboutData,
      getHomePage
   }
})