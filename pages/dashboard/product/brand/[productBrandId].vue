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
  title: "Admin | Single Product Brand Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validateSlug,
  validateDescription
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-brand',
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
    // {
    //   type: "boolean",
    //   label: t("entities.fields.has_landing_page"),
    //   name: "has_landing_page",
    //   error: "",
    // },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.show_newest"),
    //   name: "show_newest",
    //   error: "",
    // },
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
  apiBaseUrl: "/admin/manage/product/product-brand",
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
      validator: validateDescription
    },
    {
      type: "text",
      label: t("entities.fields.seo_title"),
      name: "seo_title",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "textarea",
      label: t("entities.fields.seo_description"),
      name: "seo_description",
      required: true,
      validator: validateDescription,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.tags"),
      name: "tags",
      value: "",
      required: true,
      error: "",
      validator: validateString
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
    {
      type: "html",
      label: t("entities.fields.content"),
      name: "content",
      required: true,
      error: "",
      value: "",
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-brand",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productBrandManagement"),
    path: "/dashboard/product/brand",
  },
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.name ? data.value.name : data.value.slug,
        path: `/dashboard/product/product?brand_id${route.params.productBrandId}`,
      },
    )
  }
);
// :carousel="productBrandCarousel"
// :slideFields="productBrandSlideFields"
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/brand`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-brand"
      :identifier="`${route.params.productBrandId}`"
      tableName="product_brand"
    >
    <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.productBrandProduct.title')"
          :description="t('links.productBrandProduct.description')"
          :to="`/dashboard/product/product?product_brand_id=${data.id}`"
        >
          <span class="material-icon i-xs round">article</span>
        </AdminModulesManageButton>
        <AdminModulesManageButton
          :title="t('links.productBrandSlider.title')"
          :description="t('links.productBrandSlider.description')"
          :to="`/dashboard/management/product-brand?record=${data.id}`"
        >
          <span class="material-icon i-xs round">image</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
