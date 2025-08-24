import { defineStore } from 'pinia'

import { fakeProjects, fakeSingleProjectData } from '~~/mockedData'


export const useProjectsStore = defineStore('projectsStore', () => {
   const {public: {baseURL, mockData}} = useRuntimeConfig()

   const projects = ref([]) as any

   const singleProjectData = ref({}) as any

   async function getProjects({locale}:any) {

      try {
         if (mockData) {
            projects.value = fakeProjects
            return
         }

         let URL = `/${locale}/project`

         const query = {
            orderBy: 'created_at DESC',
         }

         const res:any = await $fetch(URL, {
               method: 'get',
               query,
               baseURL,
         })
         projects.value = res.result
      } catch (error:any) {
         console.log("🚀 ~ file: projects.ts:19 ~ getProjects ~ error:", error)
      }
   }  
   
   async function getSingleProjectData({locale, id}:any) {

      try {
         if (mockData) {
            singleProjectData.value = fakeSingleProjectData
            return
         }

         let URL = `/${locale}/project/${id}`


         const res:any = await $fetch(URL, {
               method: 'get',
               baseURL,
         })
         singleProjectData.value = res
      } catch (error:any) {
         console.log("🚀 ~ file: projects.ts:34 ~ getSingleProjectData ~ error:", error)
      }
   }  
    
   return {
      projects,
      singleProjectData,
      getProjects,
      getSingleProjectData
   }
})