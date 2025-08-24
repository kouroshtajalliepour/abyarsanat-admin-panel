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
  title: "Admin | Single Product Guaranty Management",
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

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-guaranty',
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
  ],
  apiBaseUrl: "/admin/manage/product/product-guaranty",
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
  ],
  apiBaseUrl: "/admin/manage/product/product-guaranty",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productGuarantyManagement"),
    path: "/dashboard/product/guaranty",
  },
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.name ? data.value.name : data.value.slug,
        path: `/dashboard/product/guaranty/${route.params.productGuarantyId}`,
      },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/guaranty`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product-guaranty"
      :identifier="`${route.params.productGuarantyId}`"
      tableName="product_guaranty"
    >
    <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.productProductGuaranty.title')"
          :description="t('links.productProductGuaranty.description')"
          :to="`/dashboard/product/product?guaranty_included=${data.id}`"
        >
          <span class="material-icon i-xs round">article</span>
        </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
