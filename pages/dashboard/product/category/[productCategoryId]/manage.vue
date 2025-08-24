<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken
const { data } = storeToRefs(adminStore) as any;

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Category Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validateDescription,
  validateNumber,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-category',
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
          type: "text",
          label: t("entities.fields.homepage_index"),
          name: "homepage_index",
          value: "",
          required: false,
          error: "",
          validator: validateNumber
        },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.has_landing_page"),
    //   name: "has_landing_page",
    //   error: "",
    // },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.show_promoted_products"),
    //   name: "show_promoted_products",
    //   error: "",
    // },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.show_sub_categories"),
    //   name: "show_sub_categories",
    //   error: "",
    // },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.show_top_sales"),
    //   name: "show_top_sales",
    //   error: "",
    // },
    // {
    //   type: "boolean",
    //   label: t("entities.fields.show_description"),
    //   name: "show_description",
    //   error: "",
    // },
    // {
    //   type: "select",
    //   label: t("entities.fields.slider_type"),
    //   name: "slider_type",
    //   value: "product_category",
    //   required: false,
    //   error: "",
    //   options: {
    //     nameKey: "name",
    //     valueKey: "value",
    //     options: [
    //       {
    //         name: t("entities.values.slider_type.container"),
    //         value: "container",
    //       },
    //       {
    //         name: t("entities.values.slider_type.full-screen"),
    //         value: "full-screen",
    //       },
    //     ],
    //   },
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
  apiBaseUrl: "/admin/manage/product/product-category",
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
  apiBaseUrl: "/admin/manage/product/product-category",
  identifier: "id",
});
function getLinksToPush(){
  return new Promise((resolve:any, reject:any) => {
    const InheritanceArray = Object.keys(data.value.inheritance)
      
    
    const linksTuPush = [] as any
    for (let i = 0; i < InheritanceArray.length; i++) {
      const {
        id,
        slug,
        name
      } = data.value.inheritance[InheritanceArray[i]];
      

      linksTuPush.unshift({
        name: name ? name : slug,
        path: `/dashboard/product/category/${id}`,
      })
    }

    resolve(linksTuPush)
  })
}
watch(
  () => data.value,
  async () => {
    const linksTuPush = await getLinksToPush() as any
    links.value.push(...linksTuPush)
    links.value.push({
      name: t('links.topLinks.management'),
      path: `/dashboard/product/category/${route.params.productCategoryId}/manage`,
    })
  }
);

const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productCategoryManagement"),
    path: "/dashboard/product/category/root",
  },
]);
// :slideFields="productCategorySlideFields"
// :carousel="productCategoryCarousel"
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/category`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-category"
      :identifier="`${route.params.productCategoryId}`"
      tableName="product_category"
    >
      <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.productCategoryBrands.title')"
          :description="t('links.productCategoryBrands.description')"
          :to="`/dashboard/product/category/${route.params.productCategoryId}/brands`"
        >
          <span class="material-icon i-xs round">branding_watermark</span>
        </AdminModulesManageButton>
        <div class="page-buttons" v-if="data.contains === 'product'">
          <AdminModulesManageButton
            :title="t('links.productCategoryProducts.title')"
            :description="t('links.productCategoryProducts.description')"
            :to="`/dashboard/product/product?product_category_id=${route.params.productCategoryId}`"
          >
            <span class="material-icon i-xs round">inventory_2</span>
          </AdminModulesManageButton>
          <AdminModulesManageButton
            :title="t('links.productCategoryFilters.title')"
            :description="t('links.productCategoryFilters.description')"
            :to="`/dashboard/product/category/${route.params.productCategoryId}/filter`"
          >
            <span class="material-icon i-xs round">filter_alt</span>
          </AdminModulesManageButton>
        </div>
        <AdminModulesManageButton
          v-else
          :title="t('links.productCategoryCategories.title')"
          :description="t('links.productCategoryCategories.description')"
          :to="`/dashboard/product/category/${route.params.productCategoryId}`"
        >
          <span class="material-icon i-xs round">category</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
