<script lang="ts" setup>
useHead({
  title: "Admin | Blog Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
const { t } = useI18n();
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.blogManagement"),
    path: "/dashboard/blog",
  },
]);


</script>
<template>
  <AdminPagesTopLinks :links="links" />
  <div>
    <AdminModulesManageButton
      :title="t(`pages.blogManagement.title`)"
      :description="t(`pages.blogManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/blog/blog`)"
    >
    <span class="material-icon round i-xs">newspaper</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.blogCategoryManagement.title`)"
      :description="t(`pages.blogCategoryManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/blog/category`)"
    >
    <span class="material-icon round i-xs">category</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.blogTagManagement.title`)"
      :description="t(`pages.blogTagManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/blog/tag`)"
    >
    <span class="material-icon round i-xs">tag</span>
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
