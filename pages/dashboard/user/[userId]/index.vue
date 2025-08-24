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
  title: "Admin | Single User Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validateIranianPhoneNumber,
  makeValidatePassword,
  validateEmail
} = useValidators() as any


const validatePassword = makeValidatePassword(['lowercase', 'uppercase', 'number', 'symbol'])

const validateUniqueEmail = makeUniqueValidator({
  key: 'email',
  validator: validateEmail,
  url: '/admin/manage/user/user',
  token
})
const validateUniquePhoneNumber = makeUniqueValidator({
  key: 'phone_number',
  validator: validateIranianPhoneNumber,
  url: '/admin/manage/user/user',
  token
})

const localePath = useLocalePath()

const validateString = makeValidateString()


const links = ref([
  {
    name: t("links.topLinks.userManagement"),
    path: "/dashboard/user",
  },
  
]);
const usersUpdate = ref({
  title: t("buttons.updateQuote"),
  apiBaseUrl: "/admin/manage/user/user/",
  identifier: "id",
  fieldsToUpload: [],
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
      type: "text",
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
})

watch(
  () => data.value,
  async () => {
    links.value.push({
      name: `${data.value.first_name} ${data.value.last_name}`,
      path: `/dashboard/user/${route.params.userId}`,
    })
  }
);
const usersDelete = ref({
  title: t("buttons.delete.heading"),
  apiBaseUrl: "/admin/manage/user/user/",
  identifier: "id",
})
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/user`"
      :editBasicFields="usersUpdate"
      baseURL="/admin/manage/user/user"
      :identifier="`${route.params.userId}`"
      tableName="_user"
    >
        <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
        <div class="page-buttons">
            <AdminModulesManageButton
                :title="t('links.userAddresses.title')"
                :description="t('links.userAddresses.description')"
                :to="`/dashboard/user/${route.params.userId}/address`"
            >
                <span class="material-icon i-xs round">location_on</span>
            </AdminModulesManageButton>
            <AdminModulesManageButton
                :title="t('links.userOrders.title')"
                :description="t('links.userOrders.description')"
                :to="`/dashboard/order?user_id=${route.params.userId}`"
            >
                <span class="material-icon i-xs round">shopping_cart</span>
            </AdminModulesManageButton>
        </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
