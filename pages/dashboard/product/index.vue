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
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
]);

</script>
<template>
  <AdminPagesTopLinks :links="links" />
  <div>
    <AdminModulesManageButton
      :title="t(`pages.productManagement.title`)"
      :description="t(`pages.productManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/product`)"
    >
      <span class="material-icon round i-xs">newspaper</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.productCategoryManagement.title`)"
      :description="t(`pages.productCategoryManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/category/root`)"
    >
      <span class="material-icon round i-xs">category</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.productBrandManagement.title`)"
      :description="t(`pages.productBrandManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/brand`)"
    >
      <span class="material-icon round i-xs">branding_watermark</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.productGuarantyManagement.title`)"
      :description="t(`pages.productGuarantyManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/guaranty`)"
    >
      <span class="material-icon round i-xs">workspace_premium</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`pages.productInsuranceManagement.title`)"
      :description="t(`pages.productInsuranceManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/insurance`)"
    >
      <span class="material-icon round i-xs">attach_money</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`links.specialOfferProductManagement.title`)"
      :description="t(`links.specialOfferProductManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/special-offer`)"
    >
      <span class="material-icon round i-xs">stars</span>
    </AdminModulesManageButton>
    <AdminModulesManageButton
      :title="t(`links.selectedProductBrandManagement.title`)"
      :description="t(`links.selectedProductBrandManagement.description`)"
      :actions="{}"
      :to="localePath(`/dashboard/product/brand/selected`)"
    >
      <span class="material-icon round i-xs">check_box</span>
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
