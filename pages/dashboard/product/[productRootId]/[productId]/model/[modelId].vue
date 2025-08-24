<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const admin = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(admin)

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Model Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  validateNumber,
  validateNegativeNumber,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

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
      validator: validateSlug
    },
    {
      type: "number",
      label: t("entities.fields.price"),
      options: {
        mode: "decimal"
      },
      name: "price",
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      options: {
        mode: "decimal"
      },
      label: t("entities.fields.discounted_price"),
      name: "discounted_price",
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      options: {
        mode: "decimal"
      },
      label: t("entities.fields.available_amount"),
      name: "available_amount",
      value: "",
      required: true,
      error: "",
      validator: validateNegativeNumber
    },
    {
      type: "number",
      options: {
        mode: "decimal"
      },
      label: t("entities.fields.frozen_amount_in_warehouse"),
      name: "frozen_amount_in_warehouse",
      value: "",
      required: true,
      error: "",
      validator: validateNegativeNumber
    },
    {
      type: "number",
      options: {
        mode: "numeric"
      },
      label: t("entities.fields.max_amount_purchaseable"),
      name: "max_amount_purchaseable",
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "boolean",
      label: t("entities.fields.price_is_dynamic"),
      name: "price_is_dynamic",
      error: "",
    },
    {
      type: "table",
      label: t("entities.fields.product_guaranty"),
      name: "product_guaranty_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        selectedFieldKey: "name",
        previewUrl: "/dashboard/product/guaranty/{{ID}}",
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
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/product/product-guaranty",
        baseUrl: "",
        pageSize: 5,
        preDefined: {},
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
    },
    {
      type: "filePicker",
      label: t("entities.fields.image_url"),
      name: "image_url",
      required: false,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },

  ],
  apiBaseUrl: "/admin/manage/product/product-model",
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
  apiBaseUrl: "/admin/manage/product/product-model",
  identifier: "id",
});
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
    // edit.value.inputs[0].options.preDefined.product_category_model_id = data.value.product_category_model_id 
    links.value.push(
        {
            name: data.value?.product?.name ? data.value?.product?.name : data.value?.product?.slug,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}`,
        },
        {
            name:t("links.topLinks.modelManagement"),
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/model`,
        },
        {
            name: data.value?.name ? data.value?.name : data.value?.slug,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/model/${route.params.modelId}`,
        },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/model`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-model"
      :identifier="`${route.params.modelId}`"
      tableName="product_model"
      :pageSize="30"
      
    />
  </div>
</template>
