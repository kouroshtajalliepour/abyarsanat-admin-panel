<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const admin = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(admin)

const { t, locale } = useI18n()
// todo: add seo tags to product & product_categories
// todo: add max_requests to product_model
// todo: layout api request
// todo: page api request
// todo: user panel
const route = useRoute()
useHead({
  title: "Admin | Single Product Filter Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});


const edit = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "table",
      label: t("entities.fields.filter"),
      name: "product_category_filter_value_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        selectedFieldKey: "name",
        secondFieldBind: {
          key: "serial_id",
          value: "product_category_filter_value_serial_id",
        },
        apiBaseUrl: "/admin/manage/product/product-category-filter-value",
        baseUrl: "",
        pageSize: 5,
        filterInputs: [
          {
            type: "text",
            label: t("entities.fields.name"),
            name: "name",
            value: "",
            required: false,
            error: "",
          },
          {
            type: "text",
            label: t("entities.fields.slug"),
            name: "slug",
            options: {
              alwaysLtr: true
            },
            value: "",
            required: false,
            error: "",
          },
          {
            type: "date",
            label: t("entities.fields.created_at"),
            name: "created_at",
            value: "",
            required: false,
          },
          {
            type: "date",
            label: t("entities.fields.last_modified_at"),
            name: "last_modified_at",
            value: "",
            required: false,
          },
          {
            type: "select",
            label: t("entities.fields.orderBy"),
            name: "orderBy",
            value: "created_at desc",
            required: false,
            error: "",
            options: {
              nameKey: "name",
              valueKey: "value",
              options: [
                {
                  name: t("entities.values.orderBy.created_at.asc"),
                  value: "created_at asc",
                },
                {
                  name: t("entities.values.orderBy.created_at.desc"),
                  value: "created_at desc",
                },
              ],
            },
          },
        ],
        preDefined: {
          filter_value_not_included_in_product: route.params.productId,
        },
        visibleFields: [
          {
            value: t("entities.fields.name"),
            key: "name",
          },
          {
            value: t("entities.fields.slug"),
            key: "slug",
          },
        ],
      },
    }

  ],
  apiBaseUrl: "/admin/manage/product/product-filter",
  identifier: "id",
}) as any;
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.allProductsManagement"),
    path: `/dashboard/product/${route.params.productRootId}`,
  },
  
]);
watch(
  () => data.value.id,
  async () => {
    edit.value.inputs[0].options.preDefined.product_category_filter_id = data.value.product_category_filter_id 
    edit.value.inputs[0].options.previewUrl = `/dashboard/product/category/${data.value.category_filter?.product_category_id}/filter/${data.value.product_category_filter_id}/value/{{ID}}`
    edit.value.inputs[0].value = data.value.product_category_filter_value_id
    links.value.push(
        {
            name: data.value?.product?.name ? data.value?.product?.name : data.value?.product?.slug,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}`,
        },
        {
            name:t("links.topLinks.filterManagement"),
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter`,
        },
        {
            name: data.value?.category_filter?.name ? data.value?.category_filter?.name : data.value?.category_filter?.slug,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter/${route.params.filterId}`,
        },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter`"
      :editBasicFields="edit"
      baseURL="/admin/manage/product/product-filter"
      :identifier="`${route.params.filterId}`"
      tableName="product_filter"
      disableDelete
    />
  </div>
</template>
