<script setup lang="ts">
import jmoment from "jalali-moment";

import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
const adminStore = useAdminStore();

const { recordsFound } = storeToRefs(adminStore) as any;

// * validation

const route = useRoute();

useHead({
  title: `Admin | ${route.params.orderStatus} Order Management`,
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  validateIranianPhoneNumber,
  validateNumber,
  validateDescription,
} = useValidators() as any;

const validateString = makeValidateString();

const { t, locale } = useI18n();

const ordersGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/order/`,
  preDefined: {
    verified: "1",
    status: route.params.orderStatus,
  },
  visibleFields: [
    {
      value: t("entities.fields.payment_id"),
      key: "payment_id",
    },
    {
      value: t("entities.fields.shipment_id"),
      key: "shipment_id",
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

async function submit(inputs: any, ids: string[]) {
  if (inputs.confirmation != t("forms.deleteConfirmation")) {
    throw new Error("entities.errors.general.string.invalidField");
  }

  try {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      await adminStore.updateData({
        data: {
          status: route.params.orderStatus === "in-process" ? "packed" : "completed",
        },
        lang: locale.value,
        identifier: id,
        fieldsToUpload: [],
        url: "/admin/manage/user/order",
      });
    }
  } catch (error: any) {
    console.log("🚀 ~ submit ~ error:", error);
    throw error;
  }
}

function handleRedirect() {
  window.open(`/dashboard/order/download/${route.params.orderStatus}`, "_blank");
}

const selectAction = ref({
  title: t("pages.orders.selectAction", {
    status: t(`entities.values.status.${route.params.orderStatus}`),
  }),
  identifier: "id",
  button:
    route.params.orderStatus === "in-process"
      ? {
          icon: "inventory_2",
          title: "buttons.moveToPacking",
        }
      : {
          icon: "check_circle",
          title: "buttons.moveToFinished",
        },
  validateRecord:
    route.params.orderStatus === "packed"
      ? (record: any) => {
          console.log("🚀 ~ record:", record);
          return !record.shipment_id;
        }
      : undefined,
  inputs: [
    {
      type: "text",
      label: t("forms.deleteConfirmation"),
      name: "confirmation",
      value: "",
      required: true,
      error: "",
      options: {},
    },
  ],
  submitFunction: submit,
});

const ordersAddressUpdate = ref({
  title: t("buttons.updateQuote"),
  identifier: "id",
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
      type: "text",
      label: t("entities.fields.shipment_id"),
      name: "shipment_id",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
    {
      type: "text",
      label: t("entities.fields.shipment_cost"),
      name: "shipment_cost",
      value: "",
      required: false,
      error: "",
      validator: validateNumber,
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
    {
      type: "text",
      label: t("entities.fields.recipient_phone_number"),
      name: "recipient_phone_number",
      value: "",
      required: true,
      error: "",
      validator: validateIranianPhoneNumber,
    },
    {
      type: "text",
      label: t("entities.fields.postal_code"),
      name: "postal_code",
      value: "",
      required: false,
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
      required: false,
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
      type: "textarea",
      label: t("entities.fields.full_address"),
      name: "full_address",
      value: "",
      required: true,
      error: "",
      validator: validateDescription,
    },
    {
      type: "textarea",
      label: t("entities.fields.description"),
      name: "description",
      value: "",
      required: false,
      error: "",
      validator: validateString,
    },
  ],
});

const links = ref([
  {
    name: t("links.topLinks.orderManagement"),
    path: "/dashboard/order",
  },
  {
    name: t(`links.topLinks.orderStatusPage`, {
      order: t(`entities.values.status.in-process`),
    }),
    path: `/dashboard/order/status/in-process`,
  },
  {
    name: t(`links.topLinks.orderStatusPage`, {
      order: t(`entities.values.status.packed`),
    }),
    path: `/dashboard/order/status/packed`,
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="ordersGet"
      :update="ordersAddressUpdate"
      :selectAction="selectAction"
      disableFileOutput
      :hideLogs="true"
      tableName="user_transaction"
      apiBaseUrl="/admin/manage/user/order"
      :baseUrl="`/dashboard/order/`"
      :singlePageIncluded="true"
      :pagination="false"
      :useCSRFToken="true"
      :pageSize="50"
    >
      <button
        v-if="recordsFound != 0"
        type="button"
        class="add-user-control-button"
        @click="handleRedirect"
      >
        <div class="add-icon-wrapper">
          <span class="material-icon round i-xs" disabled>download</span>
        </div>
        <p class="add-message">{{ t("buttons.fileOutput") }}</p>
      </button>
    </AdminPagesMultiRecordPageTemplate>
  </div>
</template>

<style></style>
