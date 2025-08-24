<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken

const {data} = storeToRefs(adminStore)

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Blog Category Management",
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
  url: '/admin/manage/blog/blog-category',
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
  apiBaseUrl: "/admin/manage/blog/blog-category",
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
  ],
  apiBaseUrl: "/admin/manage/blog/blog-category",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.blogManagement"),
    path: "/dashboard/blog",
  },
  {
    name: t("links.topLinks.blogCategoryManagement"),
    path: "/dashboard/blog/category",
  },
  
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
    name: data.value.name ? data.value.name : data.value.slug,
    path: `/dashboard/blog/category/${route.params.blogCategoryId}`,
  },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/blog/category`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/blog/blog-category"
      :identifier="`${route.params.blogCategoryId}`"
      tableName="blog_category"
    >
      <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.blogCategoryBlogs.title')"
          :description="t('links.blogCategoryBlogs.description')"
          :to="`/dashboard/blog/blog?blog_category_id=${route.params.blogCategoryId}`"
        >
          <span class="material-icon i-xs round">article</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
