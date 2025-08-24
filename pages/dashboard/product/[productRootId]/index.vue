<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken

const { data } = storeToRefs(adminStore) as any;

// * validation

useHead({
  title: "Admin | Product Management",
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
  validateDescription,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product',
  locale: locale.value,
  token
})
const validateUniquePid = makeUniqueValidator({
  key: 'pid',
  validator: validateSlug,
  url: '/admin/manage/product/product',
  locale: locale.value,
  token
})

const getFile = ref({
  apiBaseUrl: "/admin/manage/product/product-model",
  preDefined: {},
  dataResult: "result",
  dataCountResult: "totalCount",

})

const productsCreate = ref({
  title: t("pages.productManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    product_category_id: route.params.productRootId
  },
  inputs: [
    {
      title: t("entities.fields.basic"),
      inputs: [
        {
          type: "text",
          label: t("entities.fields.pid"),
          name: "pid",
          options: {
            alwaysLtr: true
          },
          value: "",
          required: true,
          error: "",
          validator: validateUniquePid
        },
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
          type: "text",
          label: t("entities.fields.image_alt"),
          name: "image_alt",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
        {
          type: "text",
          label: t("entities.fields.original_name"),
          name: "original_name",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
        {
          type: "text",
          label: t("entities.fields.price_based_on"),
          name: "price_based_on",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
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
          type: "text",
          label: t("entities.fields.seo_title"),
          name: "seo_title",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
        {
          type: "textarea",
          label: t("entities.fields.seo_description"),
          name: "seo_description",
          required: true,
          validator: validateDescription,
          error: "",
        },
        {
          type: "text",
          label: t("entities.fields.tags"),
          name: "tags",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
        {
          type: "boolean",
          label: t("entities.fields.published"),
          name: "published",
          value: false,
          error: "",
        },
        {
          type: "boolean",
          label: t("entities.fields.has_multiple_types"),
          name: "has_multiple_types",
          value: false,
          error: "",
        },
        {
          type: "boolean",
          label: t("entities.fields.show_models_as_radio"),
          name: "show_models_as_radio",
          value: false,
          error: "",
        },
      ]
    },
    {
      title: t("entities.fields.weightAndSize"),
      inputs: [
        {
          type: "number",
          label: t("entities.fields.weight"),
          name: "weight",
          options: {
            mode: "decimal"
          },
          value: "",
          required: true,
          error: "",
          validator: validateNumber
        },
        {
          type: "number",
          options: {
            mode: "decimal"
          },
          label: t("entities.fields.x"),
          name: "x",
          value: "",
          required: true,
          error: "",
          validator: validateNumber
        },
        {
          type: "number",
          options: {
            mode: "decimal"
          },
          label: t("entities.fields.y"),
          name: "y",
          value: "",
          required: true,
          error: "",
          validator: validateNumber
        },
        {
          type: "number",
          options: {
            mode: "decimal"
          },
          label: t("entities.fields.z"),
          name: "z",
          value: "",
          required: true,
          error: "",
          validator: validateNumber
        },
      ]
    },
    {
      title: t("entities.fields.description"),
      inputs: [
        {
          type: "textarea",
          label: t("entities.fields.description"),
          name: "description",
          value: "",
          required: true,
          error: "",
          validator: validateString
        },
      ]
    },
    {
      title: t("entities.fields.content"),
      inputs: [
        {
          type: "html",
          label: t("entities.fields.content"),
          name: "content",
          required: true,
          error: "",
          value: "",
        },
      ]
    },
    {
      title: t("entities.fields.relations"),
      inputs: [
        {
          type: "table",
          label: t("entities.fields.brand"),
          name: "product_brand_id",
          value: "",
          required: true,
          error: "",
          options: {
            identifier: "id",
            dataResult: "result",
            dataCountResult: "totalCount",
            selectedFieldKey: "name",
            previewUrl: "/dashboard/product/brand/{{ID}}",
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
      ]
    },
    
  ],
});
const productsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/product/${route.params.productRootId}/`,
  preDefined: {},
  visibleFields: [
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
        previewUrl: "/dashboard/product/brand/{{ID}}",
        dataResult: "result",
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
});

const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: `/dashboard/product`,
  },
  
]);

function getLinksToPush(){
  return new Promise((resolve:any, reject:any) => {
    const InheritanceArray = Object.keys(data.value.inheritance)
      
    
    const linksTuPush = [] as any
    for (let i = 0; i < InheritanceArray.length; i++) {
      const {
        id,
        slug,
        name
      } = data.value.inheritance[InheritanceArray[i]];
      

      linksTuPush.unshift({
        name: name ? name : slug,
        path: `/dashboard/product/category/${id}`,
      })
    }

    resolve(linksTuPush)
  })
}

onBeforeMount(async () => {

  if(route.params.productRootId !== 'product'){

    productsGet.value.preDefined = {
      product_category_id: route.params.productRootId
    }
    links.value = [
      {
        name: t("links.topLinks.productManagement"),
        path: "/dashboard/product",
      },
      {
        name: t("links.topLinks.productCategoryManagement"),
        path: "/dashboard/product/category/root",
      },
    ]
    await adminStore.getData({
      token: adminAuth.token,
      url: `/admin/manage/product/product-category/${route.params.productRootId}`,
      query: "",
      lang: locale.value,
      dataResult: "",
    });
    const linksTuPush = await getLinksToPush() as any
    
    links.value.push(...linksTuPush)
    
    links.value.push({
      name: t("links.topLinks.productManagement"),
      path: `/dashboard/product/${route.params.productRootId}`,
    })
  }else {
    links.value.push({
      name: t("links.topLinks.allProductsManagement"),
      path: `/dashboard/product/${route.params.productRootId}`,
    })
  }

})


</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="productsGet"
      :getFile="getFile"
      tableName="product"
      :create="route.params.productRootId == 'product' ? undefined: productsCreate"
      apiBaseUrl="/admin/manage/product/product"
      :baseUrl="`/dashboard/product/${route.params.productRootId}`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
