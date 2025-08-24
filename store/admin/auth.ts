import { defineStore } from 'pinia'

export const useAdminAuthStore = defineStore('adminAuthStore', () => {

    const {public: {baseURL}} = useRuntimeConfig()
    const localePath = useLocalePath()


    const admin = ref(null) as any;
    const authToken = ref(null) as any;
    const alreadyRunning = ref(false);

    function setAdmin (Admin:any){
        admin.value = Admin
    }
    function setAuthToken (token:any){
        authToken.value = token
    }


    async function checkAuthStatus() {
        try {

            const url = 'admin/me'

            const res:any = await $fetch(`/en/${url}`, {
                method: 'get',
                baseURL,
                withCredentials: true,
                credentials: 'include',
            });
            
            console.log("🚀 ~ file: auth.ts:26 ~ checkAuthStatus ~ res:", res.admin)

            setAuthToken(res.authToken)
            setAdmin(res.admin)
            setTimeout(async() =>{
                
                await checkAuthStatus()
            }, 1000 * 60 * 14)

        } catch (error:any) {
            throw error
        }
    }
    
    
    async function triggerCheckAuthStatus(){
        try {
            if (!alreadyRunning.value) {
                await checkAuthStatus();
                alreadyRunning.value = true
            }
        } catch (error:any) {
           throw error
            
        }
    }

    async function authenticate({username, password, email, captchaToken}:any){
        try {
            const loginUrl = 'admin/auth/login'
            const authUrl = 'admin/auth/authenticate'

            const body = {
                username,
                password,
                captcha: captchaToken,
                platform: navigator.userAgent,
                ip: "testIp",
                email
            }

            const loginRes:any = await $fetch(`/en/${loginUrl}`, {
                method: 'post',
                body,
                baseURL,
                withCredentials: true,
                credentials: 'include',
            });
            console.log("🚀 ~ file: auth.ts:75 ~ authenticate ~ loginToken:", loginRes)


            const res = await $fetch(`/en/${authUrl}`, {
                method: 'post',
                body: {
                    platform: navigator.userAgent,
                    captcha: captchaToken,
                    loginToken: `Bearer ${loginRes.loginToken}`
                },
                baseURL,
                withCredentials: true,
                credentials: 'include',
            }) as any

            setAuthToken(res.authToken)
            navigateTo(localePath("/dashboard"))
        } catch (error:any) {
            console.log("🚀 ~ file: auth.ts:98 ~ authenticate ~ error:", error)
            throw error
            
        }
    }
    async function logout(){
        try {
            const url = 'admin/auth/logout'


            const headers = {
            } as any

            const res:any = await $fetch(`/en/${url}`, {
                method: 'delete',
                headers,
                baseURL,
                withCredentials: true,
                credentials: 'include',
            });
            navigateTo(localePath("/auth"))
        } catch (error:any) {
            throw error
            
        }
    }

    return {
        admin,
        authToken,
        setAdmin,
        logout,
        setAuthToken,
        checkAuthStatus,
        triggerCheckAuthStatus,
        authenticate
    }

})
  