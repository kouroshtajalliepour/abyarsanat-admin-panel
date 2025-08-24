import { defineStore } from 'pinia'
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin";

const {uploadUsingSignedUrl} = useUpload()

export const useAdminFileStore = defineStore('adminFileStore', () => {

    const {public: {baseURL}} = useRuntimeConfig()
    const adminAuth = useAdminAuthStore() as any;
    const admin = useAdminStore() as any;

    const token = adminAuth.authToken

    const files = ref([]) as any;
    const dataPages = ref([]) as any;

    const {t} = useI18n()
    

    function setDataPages(totalCount: any, pageSize:number)  {
        return new Promise<number[]>((resolve, reject) => {
            try {
                const pages: number[] = []
                const totalPages = Math.ceil(totalCount / pageSize)
                for (let i = 0; i < totalPages; i++) {
                    pages.push(i + 1)
                }
                dataPages.value = pages
                resolve(pages)
            } catch (error: any) {
                reject(error)
            }
        })
    }

    async function getFiles ({parent, orderBy, lang, pageNumber, pageSize, reset}: any){

        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`

        const PageNumber = pageNumber  ? {
            pageNumber
        } : {}

        const query = {

        } as any

        if (orderBy) {
            query.orderBy = orderBy
        }
        if (parent) {
            console.log("🚀 ~ file: file.ts:55 ~ getFiles ~ parent:", parent)
            if (parent.startsWith('search:')) {

                const Search = parent.split('search:')[1]
                query.slug = Search
            }else {

                query.parent_id = parent
            }
        }else {
            query.parent_id = 'null'
        }

        try {
            const res:any = await $fetch(`${lang}${url}`, {
                method: 'get',
                query: {
                    ...query,
                    ...PageNumber,
                    pageSize
                },
                baseURL,
                headers
            });
            console.log("🚀 ~ file: file.ts:63 ~ getFiles ~ res:", res)
            
            await setDataPages(res.totalCount, pageSize)
    
            if (reset) {
                
                files.value = res.result
            }else {
                files.value = [
                    ...files.value,
                    ...res.result
                ]
            }
        } catch (error:any) {
            console.log("🚀 ~ file: file.ts:72 ~ getFiles ~ error:", error)
            
        }

    }
    async function updateFile ({slug, id, lang}: any){
        admin.openLoading(true)

        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`

        const body = {
            slug
        }
        console.log("🚀 ~ file: file.ts:98 ~ updateFile ~ body:", body)


        try {
            const res:any = await $fetch(`${lang}${url}/${id}`, {
                method: 'put',
                body,
                baseURL,
                headers
            });
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }

    }
    async function pasteFiles ({filesToMove, parent_id, lang}: any){
        admin.openLoading(true)

        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`

        const body = {
            filters: {
                id: filesToMove,
            },
            paste_to: parent_id
        }
        console.log("🚀 ~ file: file.ts:98 ~ updateFile ~ body:", body)


        try {
            const res:any = await $fetch(`${lang}${url}/bulk`, {
                method: 'put',
                body,
                baseURL,
                headers
            });
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }

    }
    async function deleteFile ({id, lang}: any){
        admin.openLoading(true)

        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`
        const body = {
            filters: {
                id: [id],
                parent_id: id,
                anyCondition: '1'
            },
            unlinked_at: "now()"
        }


        try {
            const res:any = await $fetch(`${lang}${url}/bulk`, {
                method: 'put',
                body,
                baseURL,
                headers
            });
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }

    }
    async function createFolder ({slug, parent_id, lang}: any){
        admin.openLoading(true)

        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`

        const body = {
            slug,
            format: null,
            parent_id
        }


        try {
            const res:any = await $fetch(`${lang}${url}/folder`, {
                method: 'post',
                body,
                baseURL,
                headers
            });
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }

    }
  
    async function uploadFile ({slug, parent_id, file, format, lang}: any){
        admin.openLoading(true)
        
        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file/upload`

        console.log("🚀 ~ file: file.ts:220 ~ uploadFile ~ body.file.size:", file.size)
        const body = {
            slug,
            format,
            size: file.size,
            provider: 'arvan-cloud',
            parent_id,
        }

        try {
            const res:any = await $fetch(`${lang}${url}`, {
                method: 'post',
                body,
                baseURL,
                headers
            });

            console.log("🚀 ~ file: file.ts:213 ~ uploadFile ~ file:", file)
            const uploadResult = await uploadUsingSignedUrl(res, file) as any
            console.log("🚀 ~ file: file.ts:214 ~ uploadFile ~ uploadResult:", uploadResult)

            await confirmUpload({fileUrl: uploadResult, lang})

            // await confirmUpload({fileUrl: res.url, lang})
            
        } catch (error:any) {
            console.log("🚀 ~ file: file.ts:219 ~ uploadFile ~ error:", error)
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }

    }


    async function confirmUpload({fileUrl, lang}: any){
        admin.openLoading(true)
        const headers = {
            authorization: `Bearer ${token}`,
        }

        const url = `/admin/manage/file`

        const body = {
            filters: {
                url: [fileUrl],
            },
            linked_at: 'now()'
        }


        try {
            const res:any = await $fetch(`${lang}${url}/bulk`, {
                method: 'put',
                body,
                baseURL,
                headers
            });
            
        } catch (error:any) {
            if(!error.response){
                throw ("useCases.errors.general.unexpected")
            }
            throw new Error(t(error.response._data.message));
        } finally{
            admin.closeLoading()
        }
    }

    return {
        files,
        updateFile,
        getFiles,
        uploadFile,
        createFolder,
        pasteFiles,
        deleteFile,
        dataPages
    }

})