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
    name: t("links.topLinks.adminManagement"),
    path: "/dashboard/admin",
  },
]);


</script>
<template>
  <AdminPagesTopLinks :links="links" />
  <div>
    <AdminModulesManageButton
      :title="t(`pages.adminManagement.title`)"
      :description="t(`pages.adminManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/admin/admin`)"
    >
    <span class="material-icon round i-xs">admin_panel_settings</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.adminRoleManagement.title`)"
      :description="t(`pages.adminRoleManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/admin/role`)"
    >
    <span class="material-icon round i-xs">category</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.adminDeviceManagement.title`)"
      :description="t(`pages.adminDeviceManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/admin/device`)"
    >
    <span class="material-icon round i-xs">devices</span>
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
