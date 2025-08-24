<script setup lang="ts">
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | Admin Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const {
  makeValidateString,
  makeValidatePassword,
  makeUniqueValidator,
  validateSlug,
  validateEmail
} = useValidators() as any

const validateString = makeValidateString()
const validatePassword = makeValidatePassword(['lowercase', 'uppercase', 'number', 'symbol'])

const validateUniqueEmail = makeUniqueValidator({
  key: 'email',
  validator: validateEmail,
  url: '/admin/manage/admin',
  token
})
const validateUniqueSlug = makeUniqueValidator({
  key: 'username',
  validator: validateSlug,
  url: '/admin/manage/admin',
  token
})

const adminsCreate = ref({
  title: t("pages.adminManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
      type: "text",
      label: t("entities.fields.username"),
      name: "username",
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
      label: t("entities.fields.first_name"),
      name: "first_name",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "text",
      label: t("entities.fields.last_name"),
      name: "last_name",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "text",
      label: t("entities.fields.email"),
      name: "email",
      options: {
        mode: "email",
        alwaysLtr: true
      },
      value: "",
      required: true,
      error: "",
      validator: validateUniqueEmail
    },
    {
      type: "password",
      label: t("entities.fields.password"),
      name: "hashed_data",
      value: "",
      required: true,
      error: "",
      validator: validatePassword
    },
    {
      type: "table",
      label: t("entities.fields.role"),
      name: "role_id",
      value: "",
      required: true,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        previewUrl: "/dashboard/admin/role/{{ID}}",
        dataCountResult: "totalCount",
        selectedFieldKey: "name",
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/admin/admin-role",
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
});
const adminsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/admin/admin/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.username"),
      key: "username",
    },
    {
      value: t("entities.fields.confirmed"),
      key: "confirmed",
      type: "boolean"
    },
    {
      value: t("entities.fields.blocked"),
      key: "blocked",
      type: "boolean"
    },
    {
      value: t("entities.fields.role"),
      key: "role_name",
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
      label: t("entities.fields.username"),
      name: "username",
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
    {
      type: "table",
      label: t("entities.fields.role"),
      name: "role_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        previewUrl: "/dashboard/admin/role/{{ID}}",
        selectedFieldKey: "name",
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/admin/admin-role",
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
    }
    
  ],
});

const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin",
  },
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin/admin",
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="adminsGet"
      tableName="admin"
      :create="adminsCreate"
      apiBaseUrl="/admin/manage/admin"
      :baseUrl="`/dashboard/admin/admin/`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
