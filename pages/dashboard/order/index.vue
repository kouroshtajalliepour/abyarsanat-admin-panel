<script setup lang="ts">
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken;

// * validation

useHead({
  title: "Admin | Order Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const ordersGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/order/`,
  preDefined: {
    verified: "1",
  },
  visibleFields: [
    {
      value: t("entities.fields.payment_id"),
      key: "payment_id",
    },
    {
      value: t("entities.fields.ref_id"),
      key: "ref_id",
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
      value: t("entities.fields.status"),
      key: "status",
      _constructor: (value: any) => {
        return t(`entities.values.status.${value}`);
      },
    },
    {
      value: t("entities.fields.recipient_first_name"),
      key: "recipient_first_name",
    },
    {
      value: t("entities.fields.recipient_last_name"),
      key: "recipient_last_name",
    },
    {
      value: t("entities.fields.city_name"),
      key: "city_name",
    },
    {
      value: t("entities.fields.shipment_method"),
      key: "shipment_method",
      _constructor: (value: any) => {
        return t(`entities.values.shipmentMethods.${value || "NA"}.title`);
      },
    },
    {
      value: t("entities.fields.payed_shipment_cost"),
      key: "payed_shipment_cost",
    },
    {
      value: t("entities.fields.total_amount"),
      key: "total_promoted_amount",
    },
    {
      value: t("entities.fields.total_payed_amount"),
      key: "total_payed_amount",
    },
    {
      value: t("entities.fields.provider"),
      key: "provider",
      _constructor: (value: any) => {
        return t(`entities.values.provider.${value}`);
      },
    },
  ],
  filterInputs: [
    {
      type: "select",
      label: t("entities.fields.status"),
      name: "status",
      value: "created_at desc",
      required: false,
      error: "",
      options: {
        nameKey: "name",
        valueKey: "value",
        options: [
          {
            name: t("entities.values.status.in-process"),
            value: "in-process",
          },
          {
            name: t("entities.values.status.packed"),
            value: "packed",
          },
          {
            name: t("entities.values.status.completed"),
            value: "completed",
          },
          {
            name: t("entities.values.status.canceled"),
            value: "canceled",
          },
        ],
      },
    },
    {
      type: "text",
      label: t("entities.fields.recipient_first_name"),
      name: "recipient_first_name",
      value: "",
      required: false,
      error: "",
    },

    {
      type: "text",
      label: t("entities.fields.payment_id"),
      name: "payment_id",
      value: "",
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.ref_id"),
      name: "ref_id",
      value: "",
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.recipient_last_name"),
      name: "recipient_last_name",
      value: "",
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.recipient_phone_number"),
      name: "recipient_phone_number",
      options: {
        mode: "tel",
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
      label: t("entities.fields.user"),
      name: "user_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        previewUrl: "/dashboard/user/{{ID}}",
        dataCountResult: "totalCount",
        selectedFieldKey: "phone_number",
        filterInputs: [],
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/user/user",
        baseUrl: "",
        pageSize: 5,
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
            value: t("entities.fields.phone_number"),
            key: "phone_number",
          },
        ],
      },
    },
  ],
});

const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.orderManagement"),
    path: "/dashboard/order/pre",
  },
  {
    name: t("links.topLinks.allOrderManagement"),
    path: "/dashboard/order",
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="ordersGet"
      :hideLogs="true"
      tableName="user_transaction"
      apiBaseUrl="/admin/manage/user/order"
      :baseUrl="`/dashboard/order/`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
