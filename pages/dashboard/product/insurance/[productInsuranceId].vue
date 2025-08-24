<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const admin = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(admin) as any

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Insurance Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validatePercentage,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-insurance',
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
    {
      type: "number",
      label: t("entities.fields.percentage"),
      name: "percentage",
      options: {
        // mode: "decimal",
        mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validatePercentage,
    },
    
    {
      type: "number",
      label: t("entities.fields.discounted_percentage"),
      name: "discounted_percentage",
      options: {
        mode: "decimal",
        // mode: "numeric"
      },
      value: "",
      required: true,
      error: "",
      validator: validatePercentage,
    },
    {
      type: "filePicker",
      label: t("entities.fields.icon_url"),
      name: "icon_url",
      required: false,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-insurance",
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
    {
      type: "textarea",
      label: t("entities.fields.description"),
      name: "description",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "html",
      label: t("entities.fields.content"),
      name: "content",
      required: true,
      error: "",
      value: "",
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-insurance",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productInsuranceManagement"),
    path: "/dashboard/product/insurance",
  },
  
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.name ? data.value.name : data.value.slug,
        path: `/dashboard/product/insurance/${route.params.productInsuranceId}`,
      },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/insurance`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-insurance"
      :identifier="`${route.params.productInsuranceId}`"
      tableName="product_insurance"
    >
    <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.productProductInsurance.title')"
          :description="t('links.productProductInsurance.description')"
          :to="`/dashboard/product/product?insurance_included=${data.id}`"
        >
          <span class="material-icon i-xs round">article</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
