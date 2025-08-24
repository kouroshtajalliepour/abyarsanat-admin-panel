<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
import validateNumber from "~/validators/validateNumber";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken

const { data } = storeToRefs(adminStore) as any;

// * validation

useHead({
  title: "Admin | Product Category Management",
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
  validateDescription,
  validateSlug,
} = useValidators()

const validateString = makeValidateString()

const validateUniqueSlug = makeUniqueValidator({
  key: 'slug',
  validator: validateSlug,
  url: '/admin/manage/product/product-category',
  locale: locale.value,
  token
})

const productsCreate = ref({
  title: t("pages.productCategoryManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    parent_id: route.params.productCategoryId == 'root' ? undefined : route.params.productCategoryId
  },
  
  inputs: [
    {
      title: t("entities.fields.basic"),
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
          type: "text",
          label: t("entities.fields.homepage_index"),
          name: "homepage_index",
          value: "",
          required: false,
          error: "",
          validator: validateNumber
        },
        {
          type: "select",
          label: t("entities.fields.contains"),
          name: "contains",
          value: "product_category",
          required: false,
          error: "",
          options: {
            nameKey: "name",
            valueKey: "value",
            options: [
              {
                name: t("entities.values.contains.product"),
                value: "product",
              },
              {
                name: t("entities.values.contains.product_category"),
                value: "product_category",
              },
            ],
          },
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
      title: t("entities.fields.image_url"),
      inputs: [
        {
          type: "filePicker",
          label: t("entities.fields.icon_url"),
          name: "icon_url",
          required: false,
          error: "",
          options: {
            imageFormats: ["image/png", "image/jpeg", "image/gif"],
            allowedFormats: ["image/png", "image/jpeg", "image/gif"],
          },
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
  ],
});
const productsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/product/category/`,
  preDefined: {
    parent_id: route.params.productCategoryId == 'root' ? 'null' : route.params.productCategoryId
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
      value: t("entities.fields.contains"),
      key: "contains",
      _constructor: (value: any) => {
        return t(`entities.values.contains.${value}`)
      },
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

const localePath = useLocalePath()

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
      

      linksTuPush.unshift({
        name: name ? name : slug,
        path: `/dashboard/product/category/${id}`,
      })
    }

    resolve(linksTuPush)
  })
}

const router = useRouter()

const fromRoute = ref('yo')

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
      v-if="data?.contains !== 'product'"
      :get="productsGet"
      tableName="product_category"
      :create="productsCreate"
      apiBaseUrl="/admin/manage/product/product-category"
      :baseUrl="`/dashboard/product/category`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    >

      <button
        v-if="route.params.productCategoryId !== 'root'"
        type="button"
        class="add-user-control-button"
        @click="navigateTo(localePath(`/dashboard/product/category/${route.params.productCategoryId}/manage`))"
      >
        <div class="add-icon-wrapper">
          <span class="material-icon round i-xs" disabled>settings</span>
        </div>
        <p class="add-message">{{ t("pages.productCategoryManagement.manageTitle") }}</p>
      </button>
    </AdminPagesMultiRecordPageTemplate>
    <div v-else>
      <AdminModulesManageButton
        :title="t(`pages.productCategoryManagement.manageTitle`)"
        :description="t(`pages.productCategoryManagement.manageDescription`)"
        :actions="{}"
        :to="localePath(`/dashboard/product/category/${route.params.productCategoryId}/manage`)"
      >
      <span class="material-icon round i-xs">inventory_2</span>
      </AdminModulesManageButton>
      <AdminModulesManageButton
        :title="t('links.productCategoryFilters.title')"
        :description="t('links.productCategoryFilters.description')"
        :to="`/dashboard/product/category/${route.params.productCategoryId}/filter`"
      >
        <span class="material-icon i-xs round">filter_alt</span>
      </AdminModulesManageButton>
      <AdminModulesManageButton
        :title="t(`pages.productCategoryProductManagement.title`)"
        :description="t(`pages.productCategoryProductManagement.description`)"
        :actions="{}"
        :to="localePath(`/dashboard/product/${route.params.productCategoryId}`)"
      >
      <span class="material-icon round i-xs">inventory_2</span>
      </AdminModulesManageButton>
      
    </div>
  </div>
</template>

<style></style>
