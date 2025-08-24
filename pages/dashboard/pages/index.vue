<script setup>
useHead({
  title: "Admin | Page Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
const { t } = useI18n();
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.pages"),
    path: "/dashboard/pages"
  },
]);

const {
  public: {
    pages
  }
} = useRuntimeConfig()
</script>
<template>
  <AdminPagesTopLinks :links="links" />
  <div>
    <AdminModulesManageButton
      :title="t(`pages.info.title`)"
      :description="t(`pages.info.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/pages/info`)"
    >
      <span class="material-icon round i-xs">settings</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      v-for="page in pages"
      :title="t(`pages.${page.name}.title`)"
      :description="t(`pages.${page.name}.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/pages/${page.name}`)"
    >
      <span v-html="page.icon"></span>
    </AdminModulesManageButton>
  </div>
</template>

<style lang="scss">
.admin-body {
  * {
    color: inherit;
  }
}
</style>
