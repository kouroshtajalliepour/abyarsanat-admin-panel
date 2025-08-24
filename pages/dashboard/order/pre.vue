<script lang="ts" setup>
useHead({
  title: "Admin | Product Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
const { t } = useI18n();
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.orderManagement"),
    path: "/dashboard/order/pre",
  },
]);
</script>
<template>
  <AdminPagesTopLinks :links="links" />
  <div>
    <AdminModulesManageButton
      :title="t(`pages.filteredOrderManagement.in-process.title`)"
      :description="t(`pages.filteredOrderManagement.in-process.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/order/status/in-process`)"
    >
      <span class="material-icon round i-xs">hourglass_top</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.filteredOrderManagement.packed.title`)"
      :description="t(`pages.filteredOrderManagement.packed.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/order/status/packed`)"
    >
      <span class="material-icon round i-xs">inventory_2</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.filteredOrderManagement.completed.title`)"
      :description="t(`pages.filteredOrderManagement.completed.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/order?status=completed`)"
    >
      <span class="material-icon round i-xs">shopping_cart</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.filteredOrderManagement.canceled.title`)"
      :description="t(`pages.filteredOrderManagement.canceled.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/order?status=canceled`)"
    >
      <span class="material-icon round i-xs">cancel</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.allOrderManagement.title`)"
      :description="t(`pages.allOrderManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/order`)"
    >
      <span class="material-icon round i-xs">list_alt</span>
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
