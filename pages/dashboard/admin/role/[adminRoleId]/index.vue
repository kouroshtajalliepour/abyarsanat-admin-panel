<script lang="ts" setup>
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Admin Role Management",
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

const localePath = useLocalePath()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/admin/admin-role',
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
  apiBaseUrl: "/admin/manage/admin/admin-role",
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
  apiBaseUrl: "/admin/manage/admin/admin-role",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin",
  },
  {
    name: t("links.topLinks.adminRoles"),
    path: "/dashboard/admin/role",
  },
  {
    name: t("links.topLinks.adminSingleRole"),
    path: `/dashboard/admin/role/${route.params.adminRoleId}`,
  },
]);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/admin/role`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/admin/admin-role"
      :identifier="`${route.params.adminRoleId}`"
      tableName="admin_role"
    >
    <h1 class="page-heading">{{ t("links.adminWithAdminRoles.heading") }}</h1>
    <div class="page-buttons">
      <AdminModulesManageButton
        :title="t('links.adminWithAdminRoles.title')"
        :description="t('links.adminWithAdminRoles.description')"
        :to="`/dashboard/admin/admin?role_id=${route.params.adminRoleId}`"
      >
        <span class="material-icon i-xs round">admin_panel_settings</span>
      </AdminModulesManageButton>
      <AdminModulesManageButton
        :title="t('links.adminRoleAccess.title')"
        :description="t('links.adminRoleAccess.description')"
        :to="`/dashboard/admin/role/${route.params.adminRoleId}/access`"
      >
        <span class="material-icon i-xs round">accessibility</span>
      </AdminModulesManageButton>
    </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
