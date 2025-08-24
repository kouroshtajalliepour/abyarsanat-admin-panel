<script lang="ts" setup>
// * import
import { useAdminAuthStore } from "@/store/admin/auth";
import { storeToRefs } from "pinia";
const adminAuthStore = useAdminAuthStore()
const { admin } = storeToRefs(adminAuthStore)

const {t} = useI18n()

// * seo
useHead({
  title: "Admin | Self Management",
});
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeValidatePassword
} = useValidators()

const localePath = useLocalePath()

const validateString = makeValidateString()
const validatePassword = makeValidatePassword(['uppercase', 'lowercase', 'number', 'symbol'])


const edit = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
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
      validator: validateString
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
  apiBaseUrl: `/admin/me`,
  identifier: "",
});
const links = ref([
  {
    name: t("links.topLinks.admin"),
    path: "/dashboard/me",
  },
]);
const editPassword = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "password",
      label: t("entities.fields.password"),
      name: "hashed_data",
      value: "1",
      required: true,
      error: "",
      validator: validatePassword
    },
  ],
  apiBaseUrl: `/admin/me`,
  identifier: "",
});

</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <h1 class="page-heading">{{ t("forms.editBasicFields.heading") }}</h1>
    <div class="page-buttons">
      <AdminModulesManageButton
        :title="t('forms.editBasicFields.title')"
        :description="t('forms.editBasicFields.description')"
        :actions="{edit}"
        :record="admin"
      >
        <span class="material-icon i-xs round">edit</span>
      </AdminModulesManageButton>
      <AdminModulesManageButton
        :title="t('forms.editPassword.title')"
        :description="t('forms.editPassword.description')"
        :actions="{edit:editPassword}"
        :record="{}"
      >
        <span class="material-icon i-xs round">edit</span>
      </AdminModulesManageButton>
    </div>
  </div>
</template>