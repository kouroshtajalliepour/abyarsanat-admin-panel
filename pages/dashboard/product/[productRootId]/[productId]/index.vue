<script lang="ts" setup>
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken
import { storeToRefs } from "pinia";
const adminStore = useAdminStore() as any;
const { data } = storeToRefs(adminStore) as any;

const { t, locale } = useI18n();

const route = useRoute()
useHead({
  title: "Admin | Single Product Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  makeUniqueValidator,
  validateDescription,
  validateSlug,
  validateNumber
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

const edit = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
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
      label: t("entities.fields.original_name"),
      name: "original_name",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "number",
      options: {
        mode: "decimal"
      },
      label: t("entities.fields.weight"),
      name: "weight",
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
    {
      type: "table",
      label: t("entities.fields.brand"),
      name: "product_brand_id",
      value: "",
      required: true,
      error: "",
      options: {
        previewUrl: "/dashboard/product/brand/{{ID}}",
        identifier: "id",
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
  apiBaseUrl: "/admin/manage/product/product",
  identifier: "id",
});
const editLocalized = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
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
      label: t("entities.fields.name"),
      name: "name",
      value: "",
      required: true,
      error: "",
      validator: validateString
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
      label: t("entities.fields.price_based_on"),
      name: "price_based_on",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "textarea",
      label: t("entities.fields.description"),
      name: "description",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "html",
      label: t("entities.fields.content"),
      name: "content",
      required: true,
      error: "",
      value: "",
    },
  ],
  apiBaseUrl: "/admin/manage/product/product",
  identifier: "id",
});
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
watch(
  () => data.value,
  async () => {
    const linksTuPush = await getLinksToPush() as any
    links.value.push(...linksTuPush)
  }
);

const productImage = ref({
  field: "images",
  apiBaseUrl: "/admin/manage/product/product-image",
  identifier: "id",
  imageField: "image_url",
  // textField: "url",
  preDefined: {
    product_id: route.params.productId
  },
  inputs: [
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
})
const productSlideFields = ref([
  {
    title: t("links.productRelatedProduct.title"),
    field: "related_products",
    apiBaseUrl: "/admin/manage/product/product-related-product",
    identifier: "id",
    imageField: "image_url",
    textField: {
      default: "name",
      alt: "slug"
    },
    preDefined: {
      product_id: route.params.productId
    },
    inputs: [
      {
        type: "table",
        label: t("entities.fields.product"),
        name: "related_product_id",
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
            id: route.params.productId,
            product_not_related_to_product: route.params.productId
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
    ]
  },
  {
    title: t("links.productAvailableInsurances.title"),
    field: "available_insurances",
    apiBaseUrl: "/admin/manage/product/product-available-insurance",
    identifier: "id",
    imageField: "icon_url",
    textField: {
      default: "name",
      alt: "slug"
    },
    preDefined: {
      product_id: route.params.productId
    },
    inputs: [
      {
      type: "table",
      label: t("entities.fields.product"),
      name: "product_insurance_id",
      value: "",
      required: true,
      error: "",
      options: {
          identifier: "id",
          dataResult: "result",
          dataCountResult: "totalCount",
          selectedFieldKey: "name",
          previewUrl: "/dashboard/product/insurance/{{ID}}",
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
          apiBaseUrl: "/admin/manage/product/product-insurance",
          baseUrl: "",
          pageSize: 5,
          preDefined: {
            insurance_not_included_in_product: route.params.productId
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
    ]
  },
])

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
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/product/${route.params.productRootId}`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/product/product"
      :identifier="`${route.params.productId}`"
      tableName="product"
      :carousel="productImage"
      :slideFields="productSlideFields"
    >
      <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
          <AdminModulesManageButton
            :title="t('links.productFilters.title')"
            :description="t('links.productFilters.description')"
            :to="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/filter`"
          >
            <span class="material-icon i-xs round">filter_alt</span>
          </AdminModulesManageButton>
          <AdminModulesManageButton
            :title="t('links.productProperties.title')"
            :description="t('links.productProperties.description')"
            :to="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/property`"
          >
            <span class="material-icon i-xs round">key</span>
          </AdminModulesManageButton>
          <!-- <AdminModulesManageButton
            :title="t('links.productRelatedProduct.title')"
            :description="t('links.productRelatedProduct.description')"
            :to="`/dashboard/product/product/${route.params.productRootId}/${route.params.productId}/related-product`"
          >
            <span class="material-icon i-xs round">inventory_2</span>
          </AdminModulesManageButton> -->
          <!-- <AdminModulesManageButton
            :title="t('links.productAvailableInsurances.title')"
            :description="t('links.productAvailableInsurances.description')"
            :to="`/dashboard/product/product/${route.params.productRootId}/${route.params.productId}/related`"
          >
            <span class="material-icon i-xs round">attach_money</span>
          </AdminModulesManageButton> -->
          <AdminModulesManageButton
            :title="t('links.productModels.title')"
            :description="t('links.productModels.description')"
            :to="`/dashboard/product/${route.params.productRootId}/${route.params.productId}/model`"
          >
            <span class="material-icon i-xs round">format_list_bulleted</span>
          </AdminModulesManageButton>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
