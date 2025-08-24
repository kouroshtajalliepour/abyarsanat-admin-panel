<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | Admin Device Management",
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



const adminsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/admin/device/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.first_name"),
      key: "admin_first_name",
    },
    {
      value: t("entities.fields.last_name"),
      key: "admin_last_name",
    },
    {
      value: t("entities.fields.platform"),
      key: "platform",
    },
    {
      value: t("entities.fields.registered_ip"),
      key: "registered_ip",
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
    }
  ],
  filterInputs: [
    {
      type: "text",
      label: t("entities.fields.author_id"),
      name: "admin_id",
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
    name: t("links.topLinks.adminDeviceManagement"),
    path: "/dashboard/admin/device",
  },
]);
const devicesDelete = ref({
    title: t("buttons.delete.heading"),
  apiBaseUrl: "/admin/manage/admin/",
  identifier: "id",
})
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="adminsGet"
      tableName="admin_device"
      :Delete="devicesDelete"
      apiBaseUrl="/admin/manage/admin/admin-device"
      :baseUrl="`/dashboard/admin/device`"
      :singlePageIncluded="false"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
      hideLogs
    />
  </div>
</template>

<style></style>
