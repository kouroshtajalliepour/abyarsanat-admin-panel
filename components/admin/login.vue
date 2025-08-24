<template>
  <div class="login-lang-selection-wrapper">
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
  </div>
  <div :class="['login-page-wrapper', getDir()]">
    <AdminFormSinglePageForm
      :inputs="inputs"
      :submitFunction="submitFunction"
      class="login-form"
      captchaValidation
    />
  </div>
</template>

<script lang="ts" setup>
import { useAdminAuthStore } from "@/store/admin/auth";
const adminStore = useAdminAuthStore();
const {locales, locale, t} = useI18n() as any
const switchLocalePath = useSwitchLocalePath()
const langSelectionIsVisible = ref(false);
function mustLoadLang(){
  return locales.value.length > 1
}
const inputs = ref([
  {
    type: "text",
    label: t("entities.fields.username"),
    name: "username",
    options: {
      alwaysLtr: true
    },
    value: "",
    required: true,
    error: "",
  },
  {
    type: "text",
    label: t("entities.fields.email"),
    name: "email",
    value: "",
    required: true,
    error: "",
    options: {
      mode: "email",
      alwaysLtr: true
    }
  },
  {
    type: "password",
    label: t("entities.fields.password"),
    name: "password",
    value: "",
    required: true,
    error: "",
  },
]);

async function submitFunction(data: any) {
  try {
    await adminStore.authenticate({
      username: data.username,
      password: data.password,
      email: data.email,
      captchaToken: data.captchaToken,
    });
  } catch (error: any) {
    throw new Error("Invalid Credentials");
  }
}

function getDir() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].dir;
}
</script>

<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
@import "@/assets/scss/admin/global.scss";
*{
  margin: 0;
  padding: 0
}
.login-lang-selection-wrapper{
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  a{
    margin: 10px;
  }
}
.login-page-wrapper {
  display: flex;
  position: relative;
  min-height: calc(100vh - 100px);
  justify-content: center;
  align-items: center;
  &.rtl{
    direction: rtl;
  }
  .login-form {
    width: 90% !important;
    max-width: 600px;
  }
  form.login-form {
    background-color: $white;
    padding: $gig-white-space $lg-white-space;
    border-radius: 5px;
    box-shadow: $xs-smooth-shadow;
    min-width: 450px;
    text-align: center;
    display: inline-flex;
    flex-direction: column;
    position: relative;
    @include relative-child-margin($std-white-space, -bottom);
    &::after {
      content: "";
      opacity: 0;
      position: absolute;
      background-color: $white-50;
      inset: 0;
      pointer-events: none;
      border-radius: 5px;
      transition: opacity $duration-30;
      backdrop-filter: blur(10px);
      z-index: 1000;
    }
    &.loading {
      &::after {
        opacity: 1;
        pointer-events: all;
      }
    }
    a {
      align-self: center;
    }
  }
  h1.login-title {
    font-size: $lg-font-size;
    margin-bottom: $xlg-white-space;
    color: $coral-black;
    font-weight: 400;
  }
  input.login-password {
    margin-bottom: $xlg-white-space;
  }
  p {
    margin-bottom: $sm-white-space;
    font-size: $xs-font-size;
    font-weight: 300;
  }
  .form-login-actions {
    display: flex;
    justify-content: center;
    @include relative-child-margin($std-white-space, -right);
  }
  .login-loading-element {
    position: absolute;
    opacity: 0;
    animation: login-fade-in $duration-30 forwards;
    z-index: 10000;
  }
}

@keyframes login-fade-in {
  100% {
    opacity: 1;
  }
}
</style>
