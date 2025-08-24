<script setup lang="ts">
import jmoment from "jalali-moment";

// * validation

useHead({
  title: "Admin | Log History",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.logs"),
    path: "/dashboard/log",
  },
]);
const largeFields = ref([
  'content'
])

const hiddenFields = ref([
  'hashed_data',
]) 
const linkFields = ref({
  product_category_id: "/dashboard/product/category/{{ID}}/manage",
  product_sub_category_id: "/dashboard/product/category/{{ID}}/manage",
  parent_id: "/dashboard/product/category/{{ID}}/manage",
  role_id: "/dashboard/admin/role/{{ID}}",
  product_brand_id: "/dashboard/product/brand/{{ID}}",
  admin_id: "/dashboard/admin/admin/{{ID}}",
  blog_category_id: "/dashboard/blog/category/{{ID}}",
  blog_id: "/dashboard/blog/blog/{{ID}}",
  blog_tag_id: "/dashboard/blog/tag/{{ID}}",
  product_id: "/dashboard/product/product/{{ID}}",
  product_insurance_id: "/dashboard/product/insurance/{{ID}}",
  product_guaranty_id: "/dashboard/product/guaranty/{{ID}}",
  user_id: "/dashboard/user/{{ID}}",
})
const visibleIds = ref({
  blog: "/dashboard/blog/blog/{{ID}}",
  info: "/dashboard/pages/info",
  page: "/dashboard/pages/{{ID}}",
  admin_role: "/dashboard/admin/role/{{id}}",
  admin: "/dashboard/admin/admin/{{id}}",
  _user: "/dashboard/user/{{id}}",
  blog_category: "/dashboard/blog/category/{{id}}",
  blog_tag: "/dashboard/blog/atg/{{id}}",
  product: "/dashboard/product/product/{{id}}",
  product_category: "/dashboard/product/category/{{ID}}/manage",
  product_brand: "/dashboard/product/brand/{{id}}",
  product_insurance: "/dashboard/product/insurance/{{id}}",
  product_guaranty: "/dashboard/product/guaranty/{{id}}",
})
const imageFields = ref([
  'image_url',
  'mobile_image_url',
  'full_screen_image_url',
  'icon_url',
]) 

const tables = ref([
  {
    name: t("pages.logPage.tableName.page"),
    value: "page,page_localized_info",
  },
  {
    name: t("pages.logPage.tableName._user"),
    value: "_user,_user_localized_info",
  },
  {
    name: t("pages.logPage.tableName.blog_category"),
    value: "blog_category,blog_category_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product"),
    value: "product,product_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product_category"),
    value: "product_category,product_category_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product_brand"),
    value: "product_brand,product_brand_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product_model"),
    value: "product_model,product_model_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product_insurance"),
    value: "product_insurance,product_insurance_localized_info",
  },
  {
    name: t("pages.logPage.tableName.product_guaranty"),
    value: "product_guaranty,product_guaranty_localized_info",
  },
  {
    name: t("pages.logPage.tableName.blog"),
    value: "blog,blog_localized_info",
  },
  {
    name: t("pages.logPage.tableName.page_slide"),
    value: "page_slide,page_slide_localized_info",
  },
  {
    name: t("pages.logPage.tableName.admin"),
    value: "admin,admin_localized_info",
  },
  {
    name: t("pages.logPage.tableName.admin_role"),
    value: "admin,admin_localized_info",
  },
  {
    name: t("pages.logPage.tableName.info"),
    value: "info,info_localized_info",
  },
]);

// const authorFilterInput = ref({
//   type: "table",
//   label: t("entities.fields.author"),
//   name: "author_id",
//   value: "",
//   required: false,
//   error: "",
//   options: {
//     identifier: "id",
//     dataResult: "result",
//     dataCountResult: "totalCount",
//     selectedFieldKey: "username",
//     // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
//     apiBaseUrl: "/admin/manage/admin",
//     baseUrl: "",
//     pageSize: 5,
//     preDefined: {},
//     visibleFields: [
//       {
//         value: "name",
//         key: "name",
//       },
//       {
//         value: "slug",
//         key: "slug",
//       },
//     ],
//   },
// });
const {
  validateULID
} = useValidators()
const authorFilterInput = ref({
  type: "text",
  label: t("entities.fields.author"),
  name: "author",
  options: {
    alwaysLtr: true
  },
  value: "",
  validator: validateULID,
  required: false,
  error: "",
})
function goToAuthorPage(record: any) {
  console.log(record);
  if (record.author_role === 'admin') {
    navigateTo(localePath(`/dashboard/admin/admin/${record.author}`))
  }
  if (record.author_role === 'user') {
    navigateTo(localePath(`/dashboard/user/${record.author}`))
  }
}

const route = useRoute();
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesLogPage
      :linkFields="linkFields"
      :largeFields="largeFields"
      :visibleIds="visibleIds"
      :imageFields="imageFields"
      @goToAuthorPage="goToAuthorPage"
      :hiddenFields="hiddenFields"
      :tables="tables"
      :authorFilterInput="authorFilterInput"
    />
  </div>
</template>

<style></style>
