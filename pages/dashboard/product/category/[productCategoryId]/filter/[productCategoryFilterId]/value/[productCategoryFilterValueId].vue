<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(adminStore)

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Category Filter Value Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-category-filter-value',
  locale: locale.value,
  token
})

const edit = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "text",
      label: t("entities.fields.slug"),
      name: "slug",
      options: {
        alwaysLtr: true
      },
      value: "",
      required: true,
      error: "",
      validator: validateUniqueSlug
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-category-filter-value",
  identifier: "id",
});
const editLocalized = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "text",
      label: t("entities.fields.name"),
      name: "name",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-category-filter-value",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productCategoryManagement"),
    path: "/dashboard/product/category/root",
  },
  {
    name: t('links.topLinks.filterManagement'),
    path: `/dashboard/product/category/${route.params.productCategoryId}/filter`,
  },
]);

watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.filter.name ? data.value.filter.name : data.value.filter.slug,
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}/value`,
      },
      {
        name: t('links.topLinks.filterValueManagement'),
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}/value`,
      },
      {
        name: data.value.name ? data.value.name : data.value.slug,
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}/value/${route.params.productCategoryFilterValueId}`,
      }
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}/value`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-category-filter-value"
      :identifier="`${route.params.productCategoryFilterValueId}`"
      tableName="product_category_filter_value"
    >
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
