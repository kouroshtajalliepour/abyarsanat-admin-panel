<script setup lang="ts">
import { useAdminAuthStore } from "@/store/admin/auth";
const adminStore = useAdminAuthStore();
import { storeToRefs } from "pinia";
import { useUrl } from "~/composables/useUrl";
const { getUrl } = useUrl();
const { admin } = storeToRefs(adminStore) as any;
function mustLoadLang(){
  return locales.value.length > 1
}
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
const langSelectionIsVisible = ref(false);
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
    <div class="sidebar-controls-component">
      <div class="top-controls-component">
        <span v-if="admin" class="user-profile-picture">
          <img 
            v-if="admin?.image_url" 
            @click="emit('toggleImage')" 
            :src="getUrl(admin.image_url)"
            class="avatar-image" 
          />
          <img 
            v-else 
            @click="emit('toggleImage')" 
            :src="'/images/logo.png'"
            class="avatar-image" 
          />
        </span>
        <button type="button" class="menu-button" @click="emit('toggle')">
          <span class="material-icon round">menu</span>
        </button>
      </div>

      <div class="bottom-controls-component">
        <button
          type="button"
          v-if="mustLoadLang()"
          @click="langSelectionIsVisible = !langSelectionIsVisible"
        >
          <span class="material-icon round">language</span>
        </button>
        <div v-if="langSelectionIsVisible">
          <NuxtLink
            class="langs"
            v-for="(lang, index) in locales"
            @click="langSelectionIsVisible = !langSelectionIsVisible"
            :key="index"
            :to="switchLocalePath(lang.code)"
          >
            {{ lang.displayName }}
          </NuxtLink>
        </div>
        <NuxtLink class="home" :to="localePath('/dashboard')">
          <span class="material-icon round">home</span>
        </NuxtLink>
        <NuxtLink class="home" :to="localePath('/dashboard/log')">
          <span class="material-icon round">history</span>
        </NuxtLink>
        <NuxtLink class="home" :to="localePath('/dashboard/file-management')">
          <span class="material-icon round">folder</span>
        </NuxtLink>
        <!-- <NuxtLink class="notifications" :to="localePath('/dashboard/notifications')" >
          <div class="notifications-icon-wrapper">
            <span
              v-if="notificationsCount && notificationsCount > 0"
              class="notifications-count"
              >{{ notificationsCount }}</span
            >
            <span class="material-icon round">notifications</span>
          </div>
        </NuxtLink> -->
        <button type="button" @click="askedToLogOut = true">
          <span class="material-icon round logout-button">logout</span>
        </button>
      </div>
    </div>

    <!-- Content selector -->
    <div :class="['sidebar-content-selector-wrapper', collapsed ? 'collapsed' : '']">
      <div class="sidebar-content-selector-title-wrapper">
        <div class="sidebar-content-selector-title">
          <!-- <IconHome class="home-icon" disabled /> -->
          <h3 class="content-selector-title">{{ getProjectName() }}</h3>
        </div>
      </div>
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
          >
            <div class="selector-icon-wrapper">
              <span v-html="link.icon"></span>
            </div>
            <div class="selector-text-wrapper">
              <p class="selector-text">{{ t(getLinkName(link.name)) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/admin/helpers/_variables.scss";
.sidebar-component {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 7;
  height: 100vh;
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
    height: 100vh;
    overflow: hidden;
    max-width: 600px;
    min-width: 300px;
    transition: transform $duration-15, width $duration-15, opacity $duration-15,
      min-width $duration-15, max-width $duration-15;
    &.collapsed {
      min-width: 0px;
      max-width: 0px;
      width: 0px;
      pointer-events: none;
      transform: translateX(100%);
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
    padding: $lg-padding $md-padding;
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
    margin-top: auto;
    .home-icon {
      color: white;
    }
  }
  h3.content-selector-title {
    color: $white;
    font-size: $sm-font-size;
    font-weight: 400;
  }
  h4.sidebar-content-selectors-list-title {
    color: $coral-black;
    font-size: $sm-font-size;
    font-weight: 400;
  }
  .selectors-list {
    @include relative-child-margin($std-white-space, -bottom);
    display: flex;
    flex-direction: column;
    margin-top: $std-white-space;
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
}
.langs:hover {
  color: $primary;
}

.sidebar-controls-component {
  position: relative;
  z-index: 10;
  align-items: center;
  background-color: $white;
  display: flex;
  flex-direction: column;
  height: inherit;
  justify-content: space-between;
  padding: $lg-padding 0;
  width: 100px;
}
.bottom-controls-component {
  @include relative-child-margin($std-white-space, -top);
  align-items: center;
  display: flex;
  flex-direction: column;
}

.top-controls-component {
  @include relative-child-margin($std-white-space, -bottom);
  align-items: center;
  display: flex;
  flex-direction: column;
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
</style>
