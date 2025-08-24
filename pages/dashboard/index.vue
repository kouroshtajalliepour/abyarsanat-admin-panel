<template>
  <div class="admin-panel-home-wrapper">
    <img src="/images/logo.png" alt="logo" />
    <h3>{{ getProjectName() }}</h3>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
useHead({
  title: "Admin | Home",
});

const { locales, locale } = useI18n();

function getProjectName() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].title;
}
</script>
<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
.admin-body {
  .admin-panel-home-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    color: $primary !important;
    img {
      object-fit: contain;
      height: 600px;
      width: 600px;
      margin: auto;
    }
    h3 {
      text-align: center;
      margin: 40px;
      font-size: 1.5em;
    }
  }
}
</style>
