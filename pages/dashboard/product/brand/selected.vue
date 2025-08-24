<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";
const adminStore = useAdminStore() as any;
const { multiData } = storeToRefs(adminStore) as any;

// * validation

useHead({
  title: "Admin | Selected Product Brand Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const productCategoriesDelete = ref({
  title: t("pages.selectedProductBrandManagement.deleteQuote"),
  identifier: "id"
})

const productCategoriesCreate = ref({
  title: t("pages.selectedProductBrandManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
      type: "table",
      label: t("entities.fields.product_brand"),
      name: "product_brand_id",
      value: "",
      required: true,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        previewUrl: "/dashboard/product/brand/{{ID}}",
        selectedFieldKey: "name",
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/product/product-brand",
        baseUrl: "",
        pageSize: 5,
        preDefined: {
            product_brand_is_selected: '0'
        },
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
}) as any;
const productCategoriesGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/product/brand/selected`,
  preDefined: {
    orderBy: "index_number ASC"
  },
  visibleFields: [
    {
      value: t("entities.fields.index_number"),
      key: "index_number",
    },
    {
      value: t("entities.fields.name"),
      key: "name",
    },
    {
      value: t("entities.fields.slug"),
      key: "slug",
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
  ],
});

const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productBrandManagement"),
    path: "/dashboard/product/brand",
  },
  {
    name: t("links.topLinks.selectedProductBrandManagement"),
    path: "/dashboard/product/brand/selected",
  },
]);
const extraActions = ref([
  {
    icon: "sync_alt",
    inputs: [
      {
        type: "select",
        label: t("entities.fields.index_number"),
        name: "index_number",
        value: '',
        error: "",
        options: {
          nameKey: "key",
          valueKey: "value",
          options: [],
        },
      }
    ],
    submitFunction: submitMove
  }
])


async function submitMove(data:any, selectedRecord:any){
  try {
    const currentIndex = parseInt(selectedRecord.index_number)

    const selectedIndex = data.index_number

    if(!currentIndex || currentIndex == selectedIndex) {
      return
    }

    const slideWithSelectedIndex = multiData.value[selectedIndex - 1]
    await adminStore.updateData({
      data: {
          index_number: currentIndex.toString(),
      },
      lang: locale.value,
      url: "/admin/manage/product/selected-product-brand",
      useCsrf: false,
      identifier: slideWithSelectedIndex.id,
      dataResult: "result",
      fieldsToUpload: [],
    });
    await adminStore.updateData({
      data: {
        index_number: slideWithSelectedIndex.index_number
      },
      lang: locale.value,
      url: "/admin/manage/product/selected-product-brand",
      useCsrf: false,
      identifier: selectedRecord.id,
      dataResult: "result",
      fieldsToUpload: [],
    });
    location.reload();
      
  } catch (error:any) {
    console.log(error)
  }
}

watch(
  () => multiData.value,
  () => {
    productCategoriesCreate.value.preDefined.index_number = multiData.value?.length ? (Number(multiData.value[multiData.value.length - 1].index_number) + 1).toString(): '1'
    if (multiData.value && multiData.value.length) {
      
      extraActions.value[0].inputs[0].options.options = []
      const Options = extraActions.value[0].inputs[0].options.options as any

      if (!Options.length) {
        for (let i = 0; i < multiData.value.length; i++) {
          Options.push({
            key: (i + 1).toString(),
            value: (i + 1).toString(),
          })   
        }
      }
    }
  }
)
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="productCategoriesGet"
      tableName="selected-product-brand"
      :create="productCategoriesCreate"
      :Delete="productCategoriesDelete"
      apiBaseUrl="/admin/manage/product/selected-product-brand"
      :baseUrl="`/dashboard/product/brand/selected`"
      :singlePageIncluded="false"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="20"
      :extraActions="extraActions"
    />
  </div>
</template>

<style></style>
