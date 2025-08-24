<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
const route = useRoute();
useHead({
  title: `Admin | Project Basic Info`,
});

const { t } = useI18n();


const {
  makeValidateString,
  makeValidateUrl,
  validateEmail,
  validateDescription,
} = useValidators()

const validateString = makeValidateString()
const validateUrl = makeValidateUrl(false)
const validateUrlRel = makeValidateUrl(true)
const editLocalized = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "text",
      label: t("entities.fields.instagram"),
      name: "instagram",
      value: "",
      required: false,
      options: {
        // mode: "email",
        alwaysLtr: true
      },
      error: "",
      validator: validateUrl
    },
    {
      type: "text",
      label: t("entities.fields.whats_app"),
      name: "whats_app",
      options: {
        // mode: "email",
        alwaysLtr: true
      },
      value: "",
      required: false,
      error: "",
      validator: validateUrl
    },
    {
      type: "number",
      label: t("entities.fields.contact_number"),
      name: "contact_number",
      options: {
        mode: "tel",
        alwaysLtr: true
      },
      value: "",
      required: false,
      error: "",
      validator: validateString
    },
    {
      type: "number",
      label: t("entities.fields.postal_code"),
      name: "postal_code",
      options: {
        mode: "numeric",
        alwaysLtr: true
      },
      value: "",
      required: false,
      error: "",
      validator: validateString
    },
    {
      type: "number",
      label: t("entities.fields.sale_number"),
      name: "sale_number",
      options: {
        mode: "tel",
        alwaysLtr: true
      },
      value: "",
      required: false,
      error: "",
      validator: validateString
    },
    {
      type: "number",
      label: t("entities.fields.support_number"),
      name: "support_number",
      options: {
        mode: "tel",
        alwaysLtr: true
      },
      value: "",
      required: false,
      error: "",
      validator: validateString
    },
    {
      type: "text",
      label: t("entities.fields.working_hour"),
      name: "working_hour",
      value: "",
      required: false,
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
      required: false,
      error: "",
      validator: validateEmail
    },
    {
      type: "filePicker",
      label: t("entities.fields.about_primary_image_url"),
      name: "about_primary_image_url",
      required: false,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },
    {
      type: "filePicker",
      label: t("entities.fields.about_secondary_image_url"),
      name: "about_secondary_image_url",
      required: false,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },
    {
      type: "text",
      label: t("entities.fields.main_banner_url"),
      name: "main_banner_url",
      value: "",
      required: false,
      options: {
        // mode: "email",
        alwaysLtr: true
      },
      error: "",
      validator: validateUrlRel
    },
    {
      type: "filePicker",
      label: t("entities.fields.main_banner_image_url"),
      name: "main_banner_image_url",
      required: false,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },
    {
      type: "textarea",
      label: t("entities.fields.shipment_description"),
      name: "shipment_description",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "html",
      label: t("entities.fields.about_content"),
      name: "about_content",
      required: false,
      error: "",
      value: "",
    },
  ],
  apiBaseUrl: `/admin/manage/info`,
  identifier: "id",
});
const preDefinedRecord = {
  id: '1',
};
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.pages"),
    path: "/dashboard/pages",
  },
  {
    name: t("links.topLinks.info"),
    path: "/dashboard/pages/info",
  },
]);
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/info`"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/info"
      identifier="1"
      tableName="info"
      :preDefinedRecord="preDefinedRecord"
      disableDelete
    >
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
