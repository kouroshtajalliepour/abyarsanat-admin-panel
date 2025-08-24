<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminStore } from "@/store/admin/index";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken
import { storeToRefs } from "pinia";
const adminStore = useAdminStore() as any;
const { data, multiData } = storeToRefs(adminStore) as any;

// * validation

useHead({
  title: "Admin | Special Offer Product Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const {
  makeValidateString,
  makeUniqueValidator,
  validateNumber,
  validateNegativeNumber,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/special-offer',
  locale: locale.value,
  token
})

const productCategoriesDelete = ref({
    title: t("pages.specialOfferProductManagement.deleteQuote"),
    identifier: "id"
})

const productCategoriesCreate = ref({
  title: t("pages.specialOfferProductManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
  inputs: [
    {
        type: "table",
        label: t("entities.fields.product"),
        name: "product_id",
        value: "",
        required: false,
        error: "",
        options: {
            identifier: "id",
            dataResult: "result",
            dataCountResult: "totalCount",
            selectedFieldKey: "name",
            previewUrl: "/dashboard/product/product/{{ID}}",
            filterInputs: [
                {
                type: "text",
                label: t("entities.fields.pid"),
                name: "pid",
                options: {
                    alwaysLtr: true
                },
                value: "",
                required: false,
                error: "",
                },
                {
                type: "text",
                label: t("entities.fields.name"),
                name: "name",
                value: "",
                required: false,
                error: "",
                },
                {
                type: "text",
                label: t("entities.fields.slug"),
                name: "slug",
                options: {
                    alwaysLtr: true
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
                type: "select",
                label: t("entities.fields.published"),
                name: "published",
                value: '',
                required: false,
                error: "",
                options: {
                    nameKey: "name",
                    valueKey: "value",
                    options: [
                    {
                        name: t("entities.values.published.all"),
                        value: '',
                    },
                    {
                        name: t("entities.values.published.true"),
                        value: 1,
                    },
                    {
                        name: t("entities.values.published.false"),
                        value: 0,
                    },
                    ],
                },
                },
                {
                type: "select",
                label: t("entities.fields.has_multiple_types"),
                name: "has_multiple_types",
                value: '',
                required: false,
                error: "",
                options: {
                    nameKey: "name",
                    valueKey: "value",
                    options: [
                    {
                        name: t("entities.values.has_multiple_types.all"),
                        value: '',
                    },
                    {
                        name: t("entities.values.has_multiple_types.true"),
                        value: 1,
                    },
                    {
                        name: t("entities.values.has_multiple_types.false"),
                        value: 0,
                    },
                    ],
                },
                },
                {
                type: "table",
                label: t("entities.fields.brand"),
                name: "product_brand_id",
                value: "",
                required: false,
                error: "",
                options: {
                    identifier: "id",
                    dataResult: "result",
                    previewUrl: "/dashboard/product/brand/{{ID}}",
                    dataCountResult: "totalCount",
                    selectedFieldKey: "name",
                    filterInputs: [
                    {
                        type: "text",
                        label: t("entities.fields.name"),
                        name: "name",
                        value: "",
                        required: false,
                        error: "",
                    },
                    {
                        type: "text",
                        label: t("entities.fields.slug"),
                        name: "slug",
                        options: {
                        alwaysLtr: true
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
                    ],
                    // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
                    apiBaseUrl: "/admin/manage/product/product-brand",
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
            // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
            apiBaseUrl: "/admin/manage/product/product",
            baseUrl: "",
            pageSize: 5,
            preDefined: {
                product_is_special_offer: '0'
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
  singleRecordUrl: `/dashboard/product/special-offer`,
  preDefined: {
    orderBy: "index_number ASC"
  },
  visibleFields: [
    {
      value: t("entities.fields.index_number"),
      key: "index_number",
    },
    {
      value: t("entities.fields.pid"),
      key: "pid",
    },
    {
      value: t("entities.fields.name"),
      key: "name",
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
    name: t("links.topLinks.specialOfferProductManagement"),
    path: "/dashboard/product/special-offer",
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
      url: "/admin/manage/product/special-offer",
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
      url: "/admin/manage/product/special-offer",
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
      tableName="special_offer_product"
      :create="productCategoriesCreate"
      :Delete="productCategoriesDelete"
      apiBaseUrl="/admin/manage/product/special-offer"
      :baseUrl="`/dashboard/product/special-offer`"
      :singlePageIncluded="false"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="20"
      :extraActions="extraActions"
    />
  </div>
</template>

<style></style>
