<script setup lang="ts">
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | User Management",
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
  validateIranianPhoneNumber,
  validateSlug,
  validateEmail
} = useValidators() as any

const validateString = makeValidateString()
const validatePassword = makeValidatePassword(['lowercase', 'uppercase', 'number', 'symbol'])
const validateUniquePhoneNumber = makeUniqueValidator({
  key: 'phone_number',
  validator: validateIranianPhoneNumber,
  url: '/admin/manage/user/user',
  token
})

const validateUniqueEmail = makeUniqueValidator({
  key: 'email',
  validator: validateEmail,
  url: '/admin/manage/user/user',
  token
})
const validateUniqueSlug = makeUniqueValidator({
  key: 'username',
  validator: validateSlug,
  url: '/admin/manage/user/user',
  token
})

const usersCreate = ref({
  title: t("pages.userManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
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
      type: "number",
      label: t("entities.fields.phone_number"),
      name: "phone_number",
      options: {
        mode: "tel"
      },
      value: "",
      required: true,
      error: "",
      validator: validateUniquePhoneNumber
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
      required: false,
      error: "",
      validator: validateUniqueEmail
    },
  ],
});
const usersGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/user/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.first_name"),
      key: "first_name",
    },
    {
      value: t("entities.fields.last_name"),
      key: "last_name",
    },
    {
      value: t("entities.fields.blocked"),
      key: "blocked",
      type: "boolean",
    },
    {
      value: t("entities.fields.confirmed"),
      key: "confirmed",
      type: "boolean",
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
      label: t("entities.fields.phone_number"),
      name: "phone_number",
      options: {
        mode: "tel"
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
    name: t("links.topLinks.userManagement"),
    path: "/dashboard/admin",
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="usersGet"
      tableName="user"
      :create="usersCreate"
      apiBaseUrl="/admin/manage/user/user"
      :baseUrl="`/dashboard/user/`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
