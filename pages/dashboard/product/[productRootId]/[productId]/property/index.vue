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
  title: "Admin | Product Property Management",
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
  title: t("pages.productPropertyManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    product_id: route.params.productId,
    index_number: ""
  },
  inputs: [

    {
      type: "boolean",
      label: t("entities.fields.selected"),
      name: "selected",
      value: false,
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.key"),
      name: "key",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "text",
      label: t("entities.fields.value"),
      name: "value",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },

  ],
});
const productCategoriesGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/property/`,
  preDefined: {
    product_id: route.params.productId,
    orderBy: "index_number ASC"
  },
  visibleFields: [
    {
      value: t("entities.fields.index_number"),
      key: "index_number",
    },
    {
      value: t("entities.fields.key"),
      key: "key",
    },
    {
      value: t("entities.fields.value"),
      key: "value",
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
  propertyInputs: [
    {
      type: "text",
      label: t("entities.fields.value"),
      name: "value",
      value: "",
      required: false,
      error: "",
    },
    {
      type: "text",
      label: t("entities.fields.key"),
      name: "key",
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
      
      links.value.push(
        {
          name: t("links.topLinks.propertyManagement"),
          path: `/dashboard/product/${route.params.productRootId}/${route.params.productId}/property`,
        },
      )
    } catch (error:any) {
      console.log("🚀 ~ file: property.vue:143 ~ onBeforeMount ~ error:", error)
    }

})

watch(
  () => multiData.value,
  () => {
    if (multiData.value && multiData.value.length) {
      productCategoriesCreate.value.preDefined.index_number = multiData.value.length ? (Number(multiData.value[multiData.value.length - 1].index_number) + 1).toString(): '1'
      
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
    }else {
      productCategoriesCreate.value.preDefined.index_number = "1"
    }
  }
)

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
      url: "/admin/manage/product/product-property",
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
      url: "/admin/manage/product/product-property",
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
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="productCategoriesGet"
      tableName="product_property"
      :create="(!multiData || multiData?.length < 30) ? productCategoriesCreate : undefined"
      apiBaseUrl="/admin/manage/product/product-property"
      :baseUrl="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/property`"
      :singlePageIncluded="true"
      :useCSRFToken="true"
      :pageSize="30"
      :pagination="false"
      :extraActions="extraActions"
    />
  </div>
</template>

<style></style>
