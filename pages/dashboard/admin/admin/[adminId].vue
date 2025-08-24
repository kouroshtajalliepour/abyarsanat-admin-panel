<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const admin = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(admin) as any

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
  makeValidatePassword,
  validateEmail
} = useValidators() as any


const validatePassword = makeValidatePassword(['lowercase', 'uppercase', 'number', 'symbol'])

const validateUniqueEmail = makeUniqueValidator({
  key: 'email',
  validator: validateEmail,
  url: '/admin/manage/admin',
  token
})

const localePath = useLocalePath()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/admin/admin',
  locale: locale.value,
  token
})

const links = ref([
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin",
  },
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin/admin",
  },
  {
    name: t("links.topLinks.admin"),
    path: `/dashboard/admin/admin/${route.params.adminId}`,
  },
]);
const adminsUpdate = ref({
  title: t("buttons.updateQuote"),
  apiBaseUrl: "/admin/manage/admin/",
  identifier: "id",
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
      type: "boolean",
      label: t("entities.fields.confirmed"),
      name: "confirmed",
      error: "",
    },
    {
      type: "boolean",
      label: t("entities.fields.blocked"),
      name: "blocked",
      error: "",
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
})
const adminsDelete = ref({
  title: t("buttons.delete.heading"),
  apiBaseUrl: "/admin/manage/admin/",
  identifier: "id",
})
watch(
  () => data.value,
  async () => {
    if (!data.value.role_id) {
      navigateTo(localePath('/dashboard/admin/admin'))
    }
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/admin/admin`"
      :editBasicFields="adminsUpdate"
      baseURL="/admin/manage/admin"
      :identifier="`${route.params.adminId}`"
      tableName="admin"
    >
        <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
        <div class="page-buttons">
            <AdminModulesManageButton
                :title="t('links.adminTokens.title')"
                :description="t('links.adminTokens.description')"
                :to="`/dashboard/admin/device?admin_id=${route.params.adminId}`"
            >
                <span class="material-icon i-xs round">devices</span>
            </AdminModulesManageButton>
            <AdminModulesManageButton
                :title="t('links.adminActivities.title')"
                :description="t('links.adminActivities.description')"
                :to="`/dashboard/log?author=${route.params.adminId}`"
            >
            <span class="material-icon i-xs round">timeline</span>
            </AdminModulesManageButton>
            <AdminModulesManageButton
                :title="t('links.adminsRole.title')"
                :description="t('links.adminsRole.description')"
                :to="`/dashboard/admin/role/${data.role_id}`"
            >
                <span class="material-icon i-xs round">category</span>
            </AdminModulesManageButton>
        </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
