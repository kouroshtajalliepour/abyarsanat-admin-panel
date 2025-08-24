<script setup lang="ts">
import { useAdminAuthStore } from "@/store/admin/auth";
import { useUrl } from "~/composables/useUrl";
const { getUrl } = useUrl();
const adminStore = useAdminAuthStore();
import { storeToRefs } from "pinia";
const { admin } = storeToRefs(adminStore) as any;
// * type defenitions
type ILink = {
  name: string;
  path: string;
  icon: string;
};
type ILocale = {
  code: string;
  iso: string;
  dir: string;
  displayName: string;
};

// * defining props & emits
defineProps<{
  links: ILink[];
  notificationsCount?: string;
  locales: ILocale[] | any;
  collapsed: boolean;
}>();
const emit = defineEmits(["logOut", "toggle", "toggleImage"]);

// * declaring i18n module

const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

// * functions

function getLinkName(x: any): string {
  return `links.sideLinks.${x}`;
}

const { locales, locale,t } = useI18n();

// * data

const askedToLogOut = ref(false);
const isMenuOpen = ref(false);
function getProjectName() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].title;
}
const route = useRoute()
function getLinkExtraClass(path:string){
  return route.path.includes(path) ? 'manual-link-active' : ''
}
function toggleMenu(){
  if (!isMenuOpen.value) {
    document.body.classList.add("menu-open");
  }else{
    document.body.classList.remove("menu-open");
  }
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div class="sidebar-component">
    <AdminModal
      v-if="askedToLogOut"
      class="admin-modal"
      :dialogueTitle="t('forms.logout.title')"
      @close="askedToLogOut = false"
    >
      <div class="inputs">
        <h3>{{ t("forms.logout.hint") }}</h3>
        <div class="submit-wrapper">
          <button
            class="submit-buttton previous-button"
            type="button"
            @click="askedToLogOut = false"
          >
            <span class="material-icon round">close</span>
          </button>
          <button class="submit-buttton" type="button" @click="$emit('logOut')">
            {{ t("forms.logout.submitButton") }}
          </button>
        </div>
      </div>
    </AdminModal>
    <div class="sidebar-controls-component-reserved-space"></div>
    <div class="sidebar-controls-component">
      <div class="top-controls-component">
        <span v-if="admin" class="user-profile-picture">
          <img v-if="!admin?.image_url" @click="emit('toggleImage')" :src="'/images/logo.png'" alt="" class="avatar-image" />
          <img v-else @click="emit('toggleImage')" preset="avatar" :src="getUrl(admin.image_url)" alt="" class="avatar-image" />
        </span>
        <div class="sidebar-content-selector-title">
          <!-- <IconHome class="home-icon" disabled /> -->
          <h3 class="content-selector-title">{{ getProjectName() }}</h3>
        </div>
        <button v-if="!isMenuOpen" type="button" class="menu-button" @click="toggleMenu">
          <span class="material-icon round">menu</span>
        </button>
        <button v-else type="button" class="menu-button" @click="toggleMenu">
          <span class="material-icon round">close</span>
        </button>
      </div>
    </div>

    <!-- Content selector -->
    <div v-if="isMenuOpen" :class="['sidebar-content-selector-wrapper', collapsed ? 'collapsed' : '']">
      <div class="sidebar-content-selectors-list-wrapper">
        <div class="selectors-list">
          <NuxtLink
            v-for="(link, index) in links"
            :to="localePath(link.path)"
            :key="index + 'th side link'"
            :class="[
              'sidebar-content-selector-link-component',
              getLinkExtraClass(link.path)
              // isActive ? 'nuxt-link-exact-active' : '',
            ]"
            @click="isMenuOpen = !isMenuOpen"
          >
            <div class="selector-icon-wrapper">
              <span v-html="link.icon"></span>
            </div>
            <div class="selector-text-wrapper">
              <p class="selector-text">{{ t(getLinkName(link.name)) }}</p>
            </div>
          </NuxtLink>
        </div>
        <div class="bottom-controls-component">
            <div class="langs-wrapper">
                <NuxtLink
                    class="langs"
                    v-for="(lang, index) in locales"
                    :key="index"
                    :to="switchLocalePath(lang.code)"
                    @click="isMenuOpen = !isMenuOpen"
                >
                    {{ lang.displayName }}
                </NuxtLink>
            </div>
            <NuxtLink @click="isMenuOpen = !isMenuOpen" class="home" :to="localePath('/dashboard')">
                <span class="material-icon round">home</span>
            </NuxtLink>
            <NuxtLink @click="isMenuOpen = !isMenuOpen" class="home" :to="localePath('/dashboard/log')">
                <span class="material-icon round">history</span>
            </NuxtLink>
            <NuxtLink @click="isMenuOpen = !isMenuOpen" class="home" :to="localePath('/dashboard/file-management')">
                <span class="material-icon round">folder</span>
            </NuxtLink>
            <button type="button" @click="askedToLogOut = true; isMenuOpen = !isMenuOpen ">
                <span class="material-icon round logout-button">logout</span>
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/admin/helpers/_variables.scss";
.sidebar-component {
//   display: flex;
//   position: sticky;
//   top: 0;
//   z-index: 7;
  height: unset;
  .sidebar-controls-component {
    button {
      align-items: center;
      background-color: $white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      height: 36px;
      justify-content: center;
      width: 36px;
    }
  }
  .sidebar-content-selector-wrapper {
    display: flex;
    flex-direction: column;
    // height: 100vh;
    overflow: hidden;
    max-height: 100%;
    min-height: 300px;
    width: 100%;
    transition: transform $duration-15, height $duration-15, opacity $duration-15,
      min-height $duration-15, max-height $duration-15;
    &.collapsed {
      min-height: 0px;
      max-height: 0px;
      width: 0px;
      pointer-events: none;
      transform: translateY(100%);
    }
  }
  a.sidebar-content-selector-link-component {
    @include relative-child-margin($xs-white-space, -right);
    align-items: center;
    background-color: $light-coral-black-15;
    border-radius: 5px;
    color: $light-coral-black;
    cursor: pointer;
    display: block;
    display: flex;
    isolation: isolate;
    outline: 1px solid $light-coral-black-15;
    padding: $sm-padding;
    position: relative;
    transition: outline $duration-30, color $duration-30;
    &.nuxt-link-exact-active {
      box-shadow: $xs-regular-shadow;
      color: $primary;
      outline: 1px solid $primary !important;
      span.material-icon {
        color: $primary;
      }
      &::after {
        opacity: 1 !important;
      }
      .selector-icon-wrapper {
        background-color: #baf9ef;
      }
    }
    .selector-icon-wrapper {
      background-color: transparent;
      border-radius: 5px;
      display: flex;
      padding: $xs-padding;
      transition: background-color $duration-30;
    }
    &::after {
      background-color: $white;
      border-radius: 5px;
      bottom: 0;
      content: "";
      left: 0;
      opacity: 0;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      transition: opacity $duration-30;
      z-index: -1;
    }
    &:hover {
      &::after {
        opacity: $hover-opacity-light;
      }
      outline: 1px solid $light-coral-black-15;
    }
  }
  .sidebar-content-selectors-list-wrapper {
    overflow-y: auto;
    background-color: whitesmoke;
    flex-grow: 1;
    padding: 0 $md-padding;
  }
  .sidebar-content-selector-title-wrapper {
    background-color: $primary;
    display: flex;
    height: 100px;
    padding: ($md-padding + 2px) $md-padding;
  }
  .sidebar-content-selector-title {
    @include relative-child-margin(12px, -right);
    align-items: center;
    display: flex;
    .home-icon {
      color: white;
    }
  }
  h3.content-selector-title {
    color: $primary;
    font-size: $sm-font-size;
    font-weight: 400;
  }
  h4.sidebar-content-selectors-list-title {
    color: $coral-black;
    font-size: $sm-font-size;
    font-weight: 400;
  }
  .selectors-list {
    display: flex;
    flex-direction: column;
    margin-top: $std-white-space;
    min-height: calc(100vh - 195px);
    max-height: calc(100vh - 195px);
    padding: 0 5px;
    gap: 15px;
    overflow-y: auto;
  }
}

@keyframes slide-right-animation {
  0% {
    opacity: 0;
    transform: translateX(-12px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}

.langs {
  display: flex;
  flex-direction: column;
  color: black;
  cursor: pointer;
  text-align: center;
  background-color: transparent !important;
}
.langs:hover {
  color: $primary;
}

.sidebar-controls-component-reserved-space {
  height: 85px;
  width: 100%;
}
.sidebar-controls-component {
  top: 0;
  height: 85px;
  position: fixed;
  z-index: 3;
  align-items: center;
  background-color: $white;
  display: flex;
  height: inherit;
  justify-content: space-between;
  padding: 10px $lg-padding;
  width: 100%;
}
.bottom-controls-component {
  margin: 20px 0;
  align-items: center;
  gap: 10px;
  display: flex;
  justify-content: space-between;
  button {
    background-color: transparent !important;
  }
}
.langs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.top-controls-component {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
  span.user-profile-picture {
    background-color: $coral-black-50;
    border-radius: 50%;
    display: block;
    height: 64px;
    width: 64px;
  }
  img.avatar-image {
    border-radius: 50%;
    object-fit: contain !important;
    object-fit: cover;
    cursor: pointer;
  }
  span.avatar-image {
    display: block;
    border-radius: 50%;
    object-fit: cover;
  }
  button.night-mode {
    background-color: whitesmoke;
  }
}
.logout-button {
  color: red;
}

.notifications-icon-wrapper {
  position: relative;
  span.notifications-count {
    align-items: center;
    background-color: white;
    border-radius: 50%;
    color: $primary;
    display: block;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    height: 24px;
    justify-content: center;
    outline: 2px solid $coconut-milk;
    position: absolute;
    right: -8px;
    top: -8px;
    width: 24px;
  }
}
.submit-wrapper {
  display: flex;
  margin-top: 50px !important;
}
.submit-buttton {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.36);
  height: 40px;
  width: 100%;
  padding: 0 2rem;
  border-radius: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: $primary !important;
  color: white;
  font-weight: 500;
  font-size: 16px;
  border: 1px solid $primary;
  user-select: none;

  &-full {
    width: 100%;
  }

  &:hover {
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.36);
  }

  &.pad-1 {
    padding: 0 1rem;
  }
}

.previous-button {
  color: $primary !important;
  background-color: $white !important;
  flex-basis: 5% !important;
}
.home {
    background-color: transparent !important;
}
</style>
