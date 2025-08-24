<script setup lang="ts">
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | Promotion Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();
const {
  validatePercentage,
  validateSlug,
  validateNumber,
  makeUniqueValidator
} = useValidators()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/promotion',
  locale: locale.value,
  token
})


const promotionsDelete = ref({
  title: t("pages.promotionManagement.deleteQuote"),
  identifier: "id",
});
const promotionsCreate = ref({
  title: t("pages.promotionManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
      type: "text",
      label: t("entities.fields.slug"),
      name: "slug",
      value: "",
      required: true,
      error: "",
      validator: validateUniqueSlug
    },
    {
      type: "number",
      label: t("entities.fields.max_applicable_price"),
      name: "max_applicable_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.min_applicable_price"),
      name: "min_applicable_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.max_use"),
      name: "max_use",
      options: {
        // mode: "decimal",
        mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.discount_price"),
      name: "discount_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: false,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.discount_percentage"),
      name: "discount_percentage",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: false,
      error: "",
      validator: validatePercentage
    },
  ],
});
const promotionsUpdate = ref({
  title: t("pages.promotionManagement.updateQuote"),
  identifier: "id",
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
      type: "text",
      label: t("entities.fields.slug"),
      name: "slug",
      value: "",
      required: true,
      error: "",
      validator: validateUniqueSlug
    },
    {
      type: "number",
      label: t("entities.fields.max_applicable_price"),
      name: "max_applicable_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.min_applicable_price"),
      name: "min_applicable_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.max_use"),
      name: "max_use",
      options: {
        // mode: "decimal",
        mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.discount_price"),
      name: "discount_price",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: false,
      error: "",
      validator: validateNumber
    },
    {
      type: "number",
      label: t("entities.fields.discount_percentage"),
      name: "discount_percentage",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: false,
      error: "",
      validator: validatePercentage
    },
  ],
});

const promotionsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/promotion/`,
  preDefined: {
  },
  visibleFields: [
    {
      value: t("entities.fields.slug"),
      key: "slug",
    },
    {
      value: t("entities.fields.max_applicable_price"),
      key: "max_applicable_price",
    },
    {
      value: t("entities.fields.min_applicable_price"),
      key: "min_applicable_price",
    },
    {
      value: t("entities.fields.max_use"),
      key: "max_use",
    },
    {
      value: t("entities.fields.times_used"),
      key: "times_used",
    },
    {
      value: t("entities.fields.discount_price"),
      key: "discount_price",
    },
    {
      value: t("entities.fields.discount_percentage"),
      key: "discount_percentage",
    },
    {
      value: t("entities.fields.created_at"),
      key: "created_at",
      _constructor: (value: any) => {
        try {
          return jmoment(value).locale(locale.value).calendar();
        } catch (error) {
          console.log("🚀 ~ file: index.vue:285 ~ error", error);
        }
      },
    },
  ],
});

const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.promotionManagement"),
    path: "/dashboard/admin",
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="promotionsGet"
      :Delete="promotionsDelete"
      :create="promotionsCreate"
      :update="promotionsUpdate"
      :hideLogs="true"
      tableName="promotion"
      apiBaseUrl="/admin/manage/promotion"
      :baseUrl="`/dashboard/promotion/`"
      :singlePageIncluded="false"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
