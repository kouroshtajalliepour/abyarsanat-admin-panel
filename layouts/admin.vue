<script setup lang="ts">
// * i18n
// * functions
import { useAdminAuthStore } from "~/store/admin/auth";
const { locales, locale } = useI18n();
const localePath = useLocalePath()
const adminStore = useAdminAuthStore() as any;
async function logOut() {
  await adminStore.logout();
}

// * data
const {public:{sideLinks}} = useRuntimeConfig() as any

// * function
function getDir() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].dir;
}

const collapsed = ref(false);
useHead({
  bodyAttrs: {
    class: "admin-body",
  },
});
function toggle() {
  collapsed.value = !collapsed.value;
}
function toggleImage(){
  navigateTo(localePath('/dashboard/me'))
}
</script>

<template>
  <div :class="['dashboard-wrapper', getDir() === 'rtl' ? 'rtl' : '', `${locale}-font`]">
    <AdminLayoutSideBar
      class="lg-side-bar-Wrapper"
      @logOut="logOut"
      :links="sideLinks"
      :locales="locales"
      :collapsed="collapsed"
      @toggle="toggle"
      @toggleImage="toggleImage"
    />
    <AdminLayoutMobileSideBar
     class="sm-side-bar-Wrapper"
      @logOut="logOut"
      :links="sideLinks"
      :locales="locales"
      :collapsed="collapsed"
      @toggle="toggle"
      @toggleImage="toggleImage"
    />
    <div :class="['dashboard-contents', collapsed ? '' : 'bar-is-open']">
      <AdminLoading />
      <AdminModalImageModal />
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/global.scss";
@import "@/assets/scss/admin/helpers/_variables.scss";

.dashboard-wrapper.rtl {
  direction: rtl;
}
.dashboard-wrapper {
  min-height: 100vh;
  background-color: $white;
  display: flex;
  .dashboard-contents {
    max-width: calc(100% - 100px);
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: $gig-padding $xlg-padding;
    &.bar-is-open {
      max-width: calc(100% - 400px);
    }
    @include md {
      padding: 20px;
    }
  }
  @include md {
    flex-direction: column;
    .dashboard-contents {
      &.bar-is-open {
        max-width: 100%;
      }
    }
  }
}
.lg-side-bar-Wrapper {
  display: block;
  @include md{   
    display: none !important;
  }
}
.sm-side-bar-Wrapper {
  display: none;
  @include md{   
      display: block;
  }
}
</style>
