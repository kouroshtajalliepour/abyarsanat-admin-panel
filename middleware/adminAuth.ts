
import { useAdminAuthStore } from "@/store/admin/auth";


export default  defineNuxtRouteMiddleware(async(to:any, from) => {
  try {
    if (process.server) return
    const adminStore = useAdminAuthStore() as any;
    await adminStore.triggerCheckAuthStatus()
  } catch (e: any) {
    return navigateTo('/fa/auth')
  }
})

// export default async function ({ store, $axios, $router, error }: any) {
//   }
  