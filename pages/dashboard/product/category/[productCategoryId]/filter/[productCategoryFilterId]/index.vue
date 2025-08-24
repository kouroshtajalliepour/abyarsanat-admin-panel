<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
const adminStore = useAdminStore() as any;
const { data } = storeToRefs(adminStore) as any;
import { useAdminAuthStore } from "@/store/admin/auth";

const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken


const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Category Filter Management",
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
  url: '/admin/manage/product/product-category-filter',
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
  apiBaseUrl: "/admin/manage/product/product-category-filter",
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
  apiBaseUrl: "/admin/manage/product/product-category-filter",
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
]);

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
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.category.name,
        path: `/dashboard/product/category/${route.params.productCategoryId}`,
      },
      {
        name: t('links.topLinks.filterManagement'),
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter`,
      },
      {
        name: data.value.name ? data.value.name : data.value.slug,
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}`,
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
      baseURL="/admin/manage/product/product-category-filter"
      :identifier="`${route.params.productCategoryFilterId}`"
      tableName="product_category_filter"
    >
    <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.productCategoryFilterValue.title')"
          :description="t('links.productCategoryFilterValue.description')"
          :to="`/dashboard/product/category/${route.params.productCategoryId}/filter/${route.params.productCategoryFilterId}/value`"
        >
          <span class="material-icon i-xs round">check</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
