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
  title: "Admin | Product Filter Management",
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
  validateSlug,
} = useValidators()

const validateString = makeValidateString()


const productCategoriesCreate = ref({
  title: t("pages.productFilterManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    product_id: route.params.productId,
  },
  inputs: [
    {
      type: "table",
      label: t("entities.fields.filter"),
      name: "product_category_filter_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        selectedFieldKey: "name",
        secondFieldBind: {
          key: "serial_id",
          value: "product_category_filter_serial_id",
        },
        // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
        apiBaseUrl: "/admin/manage/product/product-category-filter",
        baseUrl: "",
        pageSize: 5,
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
        preDefined: {
          filter_not_included_in_product: route.params.productId
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
  singleRecordUrl: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter/`,
  preDefined: {
    product_id: route.params.productId,
  },
  visibleFields: [
    {
      value: t("entities.fields.slug"),
      key: "slug",
    },
    {
      value: t("entities.fields.name"),
      key: "name",
    },
    {
      value: t("entities.fields.value"),
      key: "value_slug",
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
  filterInputs: [],
});

const links = ref([
  {
    name: t("links.topLinks.productManagement"),
    path: "/dashboard/product",
  },
  {
    name: t("links.topLinks.productCategoryManagement"),
    path: "/dashboard/product/category/root",
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

      if (i == 1) {
          linksTuPush.unshift (
            {
              name: t("links.topLinks.productManagement"),
              path: `/dashboard/product/${id}`,
            }
          ) as any
        }
      
      if (i == 0) {
        linksTuPush.unshift({
          name: name ? name : slug,
          path: `/dashboard/product/${route.params.productRootId}/${id}`,
        })
        
      }else {
        linksTuPush.unshift({
          name: name ? name : slug,
          path: `/dashboard/product/category/${id}`,
        })

      }
    }

    resolve(linksTuPush)
  })
}
onBeforeMount(async () => {

    try {
      await adminStore.getData({
        token: adminAuth.token,
        url: `/admin/manage/product/product/${route.params.productId}`,
        query: "",
        lang: locale.value,
        dataResult: "",
      });
      const linksTuPush = await getLinksToPush() as any
      
      links.value.push(...linksTuPush)

      productCategoriesCreate.value.inputs[0].options.preDefined.product_category_id = data.value.product_category_id 
    
      
      links.value.push(
        {
          name: t("links.topLinks.filterManagement"),
          path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter`,
        },
      )
    } catch (error:any) {
      console.log("🚀 ~ file: filter.vue:143 ~ onBeforeMount ~ error:", error)
    }

})
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    
    <AdminPagesMultiRecordPageTemplate
      :get="productCategoriesGet"
      tableName="product_filter"
      :create="(!multiData || multiData?.length < 30) ? productCategoriesCreate : undefined"
      apiBaseUrl="/admin/manage/product/product-filter"
      :baseUrl="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter`"
      :pagination="false"
      :singlePageIncluded="true"
      :useCSRFToken="true"
      :pageSize="30"
    />
  </div>
</template>

<style></style>
