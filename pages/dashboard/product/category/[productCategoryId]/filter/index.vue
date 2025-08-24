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
  title: "Admin | Product Category Filter Management",
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

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-category-filter',
  locale: locale.value,
  token
})

const productCategoriesCreate = ref({
  title: t("pages.productCategoryFilterManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    product_category_id: route.params.productCategoryId,
  },
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
      type: "text",
      label: t("entities.fields.name"),
      name: "name",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },

  ],
}) as any;
const productCategoriesGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/product/category/${route.params.productCategoryId}/filter/`,
  preDefined: {
    product_category_id: route.params.productCategoryId,
    orderBy: "index_number ASC"
  },
  visibleFields: [
    {
      value: t("entities.fields.index_number"),
      key: "index_number",
    },
    {
      value: t("entities.fields.slug"),
      key: "slug",
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
    {
      value: t("entities.fields.last_modified_at"),
      key: "last_modified_at",
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
      url: "/admin/manage/product/product-category-filter",
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
      url: "/admin/manage/product/product-category-filter",
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
  if (route.params.productCategoryId != 'root') {
    try {
      
      await adminStore.getData({
        token: adminAuth.token,
        url: `/admin/manage/product/product-category/${route.params.productCategoryId}`,
        query: "",
        lang: locale.value,
        dataResult: "",
      });

      const linksTuPush = await getLinksToPush() as any
      
      links.value.push(...linksTuPush)

      links.value.push({
        name: t('links.topLinks.filterManagement'),
        path: `/dashboard/product/category/${route.params.productCategoryId}/filter`,
      })

    } catch (error) {
      console.log(error)
      // return navigateTo(localePath('/dashboard/product/category/root'));
      // throw error;
    }
  }else {
    data.value = {}
  }
})
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="productCategoriesGet"
      tableName="product_category_filter"
      :create="productCategoriesCreate"
      apiBaseUrl="/admin/manage/product/product-category-filter"
      :baseUrl="`/dashboard/product/category/${route.params.productCategoryId}/filter`"
      :singlePageIncluded="true"
      :pagination="false"
      :useCSRFToken="true"
      :extraActions="extraActions"
      :pageSize="20"
    />
  </div>
</template>

<style></style>
