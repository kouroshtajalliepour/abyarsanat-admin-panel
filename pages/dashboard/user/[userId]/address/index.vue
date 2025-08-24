<script lang="ts" setup>
import { storeToRefs } from "pinia";
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken;
const adminStore = useAdminStore() as any;

const { data } = storeToRefs(adminStore);

// * validation

useHead({
  title: "Admin | User Address Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const { makeValidateString, makeUniqueValidator, validateSlug } = useValidators();

const validateString = makeValidateString();

// const validateUniqueName = makeUniqueValidator({
//   key: 'name',
//   validator: validateString,
//   url: '/admin/manage/user/address',
//   locale: locale.value,
//   token
// })

const usersCreate = ref({
  title: t("pages.userAddressManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    user_id: route.params.userId,
  },
  inputs: [
    {
      type: "text",
      label: t("entities.fields.name"),
      name: "name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.province_name"),
      name: "province_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.city_name"),
      name: "city_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.province_id"),
      name: "province_id",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.city_id"),
      name: "city_id",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "number",
      options: {
        mode: "numeric",
      },
      label: t("entities.fields.postal_code"),
      name: "postal_code",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "textarea",
      label: t("entities.fields.full_address"),
      name: "full_address",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.building_number"),
      name: "building_number",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.building_unit"),
      name: "building_unit",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_phone_number"),
      name: "recipient_phone_number",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_first_name"),
      name: "recipient_first_name",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_last_name"),
      name: "recipient_last_name",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
  ],
});
const usersDelete = ref({
  title: t("buttons.delete.heading"),
  apiBaseUrl: "/admin/manage/user/address/",
  identifier: "id",
});
const usersEdit = ref({
  title: t("pages.userAddressManagement.updateQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  identifier: "id",
  inputs: [
    {
      type: "text",
      label: t("entities.fields.name"),
      name: "name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.province_name"),
      name: "province_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.city_name"),
      name: "city_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },

    {
      type: "number",
      options: {
        mode: "numeric",
      },
      label: t("entities.fields.postal_code"),
      name: "postal_code",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "textarea",
      label: t("entities.fields.full_address"),
      name: "full_address",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.building_number"),
      name: "building_number",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.building_unit"),
      name: "building_unit",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_phone_number"),
      name: "recipient_phone_number",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_first_name"),
      name: "recipient_first_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.recipient_last_name"),
      name: "recipient_last_name",
      value: "",
      required: true,
      error: "",
      validator: validateString,
    },
  ],
});
const usersGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/user/${route.params.userId}/address/`,
  preDefined: {
    user_id: route.params.userId,
  },
  visibleFields: [
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

const links = ref([
  {
    name: t("links.topLinks.userManagement"),
    path: "/dashboard/user",
  },
]);
await onBeforeMount(async () => {
  await adminStore.getData({
    token: adminAuth.token,
    url: `/admin/manage/user/user/${route.params.userId}`,
    query: "",
    lang: locale.value,
    dataResult: "",
  });

  links.value.push(
    {
      name: `${data.value.first_name} ${data.value.last_name}`,
      path: `/dashboard/user/${route.params.userId}`,
    },
    {
      name: t("links.topLinks.userAddressManagement"),
      path: `/dashboard/user/${route.params.userId}/address`,
    }
  );
});
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="usersGet"
      tableName="user_address"
      :create="usersCreate"
      :update="usersEdit"
      :Delete="usersDelete"
      apiBaseUrl="/admin/manage/user/address"
      :baseUrl="`/dashboard/user/${route.params.userId}/address`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
