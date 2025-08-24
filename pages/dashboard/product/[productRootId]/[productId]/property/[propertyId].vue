<script lang="ts" setup>
import {storeToRefs} from "pinia"
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const admin = useAdminStore() as any;
const token = adminAuth.authToken

const { data} = storeToRefs(admin)

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Property Management",
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
  url: '/admin/manage/product/product-property',
  locale: locale.value,
  token
})

const edit = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  apiBaseUrl: "/admin/manage/product/product-property",
  inputs: [
    {
      type: "boolean",
      label: t("entities.fields.selected"),
      name: "selected",
      required: false,
      error: "",
    },
  ],
  identifier: "id",
});

const editLocalized = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "text",
      label: t("entities.fields.key"),
      name: "key",
      value: "",
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.value"),
      name: "value",
      value: "",
      required: false,
      error: "",
    },
  ],
  apiBaseUrl: "/admin/manage/product/product-property",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.allProductsManagement"),
    path: `/dashboard/product/${route.params.productRootId}`,
  },
  
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
        {
            name: data.value.product_id,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}`,
        },
        {
            name:t("links.topLinks.propertyManagement"),
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/property`,
        },
        {
            name: data.value.name ? data.value.name : data.value.slug,
            path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/property/${route.params.propertyId}`,
        },
    )
  }
);
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/property`"
      :editLocalizedFields="editLocalized"
      :editBasicFields="edit"
      baseURL="/admin/manage/product/product-property"
      :identifier="`${route.params.propertyId}`"
      tableName="product_property"
    />
  </div>
</template>
