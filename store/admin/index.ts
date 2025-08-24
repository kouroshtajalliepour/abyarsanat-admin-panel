import { defineStore } from 'pinia'

import { useAdminAuthStore } from "@/store/admin/auth";
const {mock:fileUploadFunction} = useUpload()
import download from "downloadjs" 

export const useAdminStore = defineStore('adminStore', () => {
    const adminAuth = useAdminAuthStore() as any;
    const token = adminAuth.authToken

    const {public: {baseURL}} = useRuntimeConfig()
    const multiData:any = ref([]) as any
    const data: any = ref({}) as any
    const dataPages:any = ref([]) as any
    const inputDataPages: any = ref([]) as any
    const inputMultiData:any = ref([]) as any
    const loading = ref (false);
    const barProgress = ref(0) as any
    const imagePreview = ref(null) as any
    const contentPreview = ref(null) as any
    const recordsFound = ref(0) as any
    const getLoading = ref(false)
    const loadedAt = ref (null) as any
    
    // * utils
    function loadBar() {
        const yo = setInterval(() => {
          if (!loading.value) {
            clearInterval(yo);
          }
          if (barProgress.value !== 100) {
            barProgress.value += 1;
          } else {
            barProgress.value = 0;
          }
        }, 5);
    }
    function openLoading(autoLoad:boolean) {
        if (window && document) {
            if(autoLoad){
                loadBar()
            }
            document.body.classList.add("loading-open");
            loading.value = true
        }
    }
    function closeLoading(){
        if (window && document) {
            document.body.classList.remove("loading-open");
            loading.value = false
        }
    }
    function setDataPages(totalCount: any, pageSize:number, getForInput:boolean)  {
        return new Promise<number[]>((resolve, reject) => {
            try {
                const pages: number[] = []
                const totalPages = Math.ceil(totalCount / pageSize)
                for (let i = 0; i < totalPages; i++) {
                    pages.push(i + 1)
                }
                if (getForInput) {
                    inputDataPages.value = pages
                }else{
                    dataPages.value = pages
                }
                resolve(pages)
            } catch (error: any) {
                reject(error)
            }
        })
    }
    
    // * actions
    async function getData({ url, query, lang, dataResult, loading }: any) {

        if (loading) {
            getLoading.value = true
        }

        try {
            const headers = {
                authorization: `Bearer ${token}`,
            }
          
            let URL = `/${lang}${url}${query}`

            const res:any = await $fetch(URL, {
                method: 'get',
                baseURL,
                headers
            })
            
            
            if(dataResult){

                data.value = res[dataResult]
                return res[dataResult]
            }else{
                data.value = res
                return res
            }
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            switch (error.response?.status) {
                case 404:
                    throw new Error("404");
                    
                    break;
                case 500:
                    throw new Error("500");
                    
                    break;
                case 403:
                    throw new Error("403");
                    
                    break;
                case 429:
                    throw new Error("429");
                    
                    break;
            
                default:
                    break;
            }
            throw error
          
        }finally{
            getLoading.value = false
        }
    }
    async function getSingleData({  url, lang, dataResult }: any) {
        try {
  
            const headers = {
                authorization: `Bearer ${token}`,
            }
          
            let URL = `/${lang}${url}`

            const res:any = await $fetch(URL, {
                method: 'get',
                baseURL,
                headers
            })
            
        } catch (error:any) {
            throw new Error("404");
          
        }
    }
    async function getLocales({  url, lang, dataResult }: any) {
        try {
  
            const headers = {
                authorization: `Bearer ${token}`,
            }
          
            let URL = `/${lang}${url}/locales`

            const res:any = await $fetch(URL, {
                method: 'get',
                baseURL,
                headers
            })
            
            
            if(dataResult){

                data.value = res[dataResult]
                return res[dataResult]
            }else{
                data.value = res
                return res
            }
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            switch (error.response?.status) {
                case 404:
                    throw new Error("404");
                    
                    break;
                case 500:
                    throw new Error("500");
                    
                    break;
                case 403:
                    throw new Error("403");
                    
                    break;
                case 429:
                    throw new Error("429");
                    
                    break;
            
                default:
                    break;
            }
            throw error
          
        }
    }
    
    async function getMultiData(
        {
          
        
          lang,
          keepOldData,
          dataResult,
          dataCountResult,
          url,
          preDefined,
          pageSize,
          pageNumber,
          query,
          getForInput
        }: any
    ) {

        if (!getForInput && (!pageNumber || pageNumber == 1)) {
            getLoading.value = true
        }
        try {
            const PreDefined = preDefined ? preDefined : {}
            const PageNumber = pageNumber  ? {
                pageNumber
            } : {}
            const headers = {
                authorization: `Bearer ${token}`,
            }
            console.log("🚀 ~ file: index.ts:224 ~ useAdminStore ~ headers:", headers)

            const Query = {
                ...query,
                ...PreDefined,
                ...PageNumber,
                pageSize
            }

            const res:any = await $fetch(`${lang}${url}`, {
                method: 'get',
                query: Query,
                baseURL,
                headers
            });

            console.log(res);

            recordsFound.value = res[dataCountResult];
        
            if (pageNumber) {
                await setDataPages(res[dataCountResult], pageSize, getForInput)
            }else{
                if (getForInput) {
                    inputDataPages.value = [1]
                }else {
                    dataPages.value = [1]
                }
            }
            if (getForInput) {
                if(keepOldData){
                    inputMultiData.value.push(...res[dataResult])
                }else{
                    inputMultiData.value = (res[dataResult])
                }
            }else {
                if(keepOldData){
                    multiData.value.push(...res[dataResult])
                }else{
                    if (res[dataResult].length) {
                        loadedAt.value = new Date()
                        multiData.value = res[dataResult]
                    }else {
                        multiData.value = null
                    }

                }
            }
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            switch (error.response?.status) {
                case 404:
                    throw new Error("404");
                    
                    break;
                case 500:
                    throw new Error("500");
                    
                    break;
                case 403:
                    throw new Error("403");
                    
                    break;
                case 429:
                    throw new Error("429");
                    
                    break;
            
                default:
                    break;
            }
            throw error
        }finally{
            getLoading.value = false
        }
    }

    async function getFileOutput(
        {
          
        
          lang,
          keepOldData,
          dataResult,
          dataCountResult,
          url,
          preDefined,
          pageSize,
          pageNumber,
          query,
          getForInput
        }: any
    ) {
        openLoading(true)
        try {
            const PreDefined = preDefined ? preDefined : {}
            const PageNumber = pageNumber  ? {
                pageNumber
            } : {}
            const headers = {
                authorization: `Bearer ${token}`,
            }
            console.log("🚀 ~ file: index.ts:224 ~ useAdminStore ~ headers:", headers)

            const Query = {
                ...query,
                ...PreDefined,
                ...PageNumber,
                pageSize
            }

            const res = await $fetch(`${lang}${url}/output/csv`, {
                method: 'get',
                query: Query,
                baseURL,
                headers
            }) as any;
            download(res,"output.csv", "text/csv")

        } catch (error:any) {
            console.log("🚀 ~ file: index.ts:345 ~ useAdminStore ~ error:", error)
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            switch (error.response?.status) {
                case 404:
                    throw new Error("404");
                    
                    break;
                case 500:
                    throw new Error("500");
                    
                    break;
                case 403:
                    throw new Error("403");
                    
                    break;
                case 429:
                    throw new Error("429");
                    
                    break;
            
                default:
                    break;
            }
            throw error
        }finally{
            closeLoading()
        }
    }

    async function createData(
        {
            
        
            lang,
            url,
            dataResult,
            data,
            fieldsToUpload,
            preDefined,
            createLocalized,
        }: any
    ) {

        const filesToLink = [] as any
        openLoading(true)
        try {
            if (fieldsToUpload) {
                for (let i = 0; i < fieldsToUpload.length; i++) {
                    const fieldToUpload = fieldsToUpload[i];
                    const value = data[fieldToUpload];

                    if (typeof value === "string") {
                        return value                        
                    }
                    
                    if (!value) {
                        throw new Error("upload field not found");
                    }
                    
                    const result = await fileUploadFunction(value);
                    data[fieldToUpload] = result
                    filesToLink.push(result)
                }
            }
            const headers = {
                authorization: `Bearer ${token}`,
            } as any

            const body = preDefined ? {...preDefined, ...data} : data

            if (!data.filesToLink || !data.filesToLink.length) {
                body.filesToLink = filesToLink
            }else {
                body.filesToLink = [...filesToLink, ...data.filesToLink]
            }
            const res:any = await $fetch(`/${lang}${url}${createLocalized? createLocalized : ''}`, {
                method: 'post',
                body: {
                    ...body,
                    ...filesToLink
                },
                baseURL,
                headers,
                credentials: 'include',
            })
            if(dataResult){
                return res[dataResult]
            }
            return res
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            console.log(error.response._data.message); 
            throw new Error(error.response._data.message); 
        } finally{
            closeLoading()
        }
    }

    async function deleteData(
        {
            
        
            lang,
            identifier,
            deleteLocalized,
            url,
            data,
        }: any
    ) {
        openLoading(true)
        try {
    
        
            const headers = {
                authorization: `Bearer ${token}`,
            }
            let URL = `/${lang}${url}`
            if (identifier) {
                URL += `/${identifier}`
            }

            const res:any = await $fetch(`${URL}${deleteLocalized? '/locale' : ''}`, {
                method: 'delete',
                body: data,
                baseURL,
                headers
            })
            return res
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(error.response._data.message)
          
        }finally{
            closeLoading()
        }
    }

    async function updateData(
        {
            
        
            lang,
            identifier,
            url,
            dataResult,
            data,
            editLocalized,
            preDefined,
            fieldsToUpload
        }: any
    ) {
        const filesToLink = [];
        openLoading(true)
        try {
            for (let i = 0; i < fieldsToUpload.length; i++) {
                const fieldToUpload = fieldsToUpload[i];
                const value = data[fieldToUpload];
                
                if (!value) {
                    throw new Error("upload field not found");
                }
                
                const result = await fileUploadFunction(value);
                    data[fieldToUpload] = result
                filesToLink.push(result)
            }
            console.log("🚀 ~ file: index.ts:426 ~ useAdminStore ~ identifier:", identifier)
            
            const headers = {
                authorization: `Bearer ${token}`,
            }
            let URL = `/${lang}${url}`
            if (identifier) {
                URL += `/${identifier}`
            }
            const body = preDefined ? {...preDefined, ...data} : data
            
            if (!data.filesToLink || !data.filesToLink.length) {
                body.filesToLink = filesToLink
            }else {
                body.filesToLink = [...filesToLink, ...data.filesToLink]
            }
            console.log("🚀 ~ file: index.ts:426 ~ useAdminStore ~ identifier:2", identifier)
            
            const res:any = await $fetch(`${URL}${editLocalized? '/locale' : ''}`, {
                method: 'put',
                body: {
                    ...body,
                    ...filesToLink
                },
                baseURL,
                headers
            })
            console.log("🚀 ~ file: index.ts:426 ~ useAdminStore ~ identifier:2", identifier)
            if(dataResult){
                return res[dataResult]
            }
            return res
        } catch (error:any) {
            console.log("🚀 ~ updateData ~ error:", error)
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(error.response._data.message);
          
        }finally{
            closeLoading()
        }
    }

    async function uploadFile(value:any) {
        openLoading(true)
        try {

            const result = await fileUploadFunction(value);
            

            return result
    
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(error.response.message);
          
        }finally{
            closeLoading()
        }
    }
      
    return { 
        multiData,
        data,
        dataPages,
        getLoading,
        getData,
        getMultiData,
        createData,
        deleteData,
        updateData,
        getLocales,
        inputDataPages,
        inputMultiData,
        loading,
        getSingleData,
        openLoading,
        closeLoading,
        uploadFile,
        getFileOutput,
        barProgress,
        imagePreview,
        contentPreview,
        recordsFound,
        loadedAt
    }
});