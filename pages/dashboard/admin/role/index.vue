<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | Admin Role Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const {
  makeValidateString,
  makeUniqueValidator,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/admin/admin-role',
  locale: locale.value,
  token
})

const adminsCreate = ref({
  title: t("pages.adminRoleManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
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
});
const adminsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/admin/role/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.slug"),
      key: "slug",
    },
    {
      value: t("entities.fields.name"),
      key: "name",
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
    {
      value: t("entities.fields.last_modified_at"),
      key: "last_modified_at",
      _constructor: (value: any) => {
        try {
          return jmoment(value).locale(locale.value).calendar();
        } catch (error) {
          console.log("🚀 ~ file: index.vue:285 ~ error", error);
        }
      },
    },
  ],
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
});
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin",
  },
  {
    name: t("links.topLinks.adminRoles"),
    path: `/dashboard/admin/role`,
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="adminsGet"
      tableName="admin_role"
      :create="adminsCreate"
      apiBaseUrl="/admin/manage/admin/admin-role"
      :baseUrl="`/dashboard/admin/role`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
