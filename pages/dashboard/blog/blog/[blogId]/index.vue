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
  title: "Admin | Single Blog Management",
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
  url: '/admin/manage/blog',
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
    {
      type: "boolean",
      label: t("entities.fields.published"),
      name: "published",
      value: false,
      error: "",
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
    {
      type: "table",
      label: t("entities.fields.category"),
      name: "blog_category_id",
      value: "",
      required: false,
      error: "",
      options: {
        identifier: "id",
        dataResult: "result",
        dataCountResult: "totalCount",
        selectedFieldKey: "name",
        previewUrl: "/dashboard/blog/category/{{ID}}",
        filterInputs: [
          
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
        apiBaseUrl: "/admin/manage/blog/blog-category",
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
  apiBaseUrl: "/admin/manage/blog",
  identifier: "id",
});
const editLocalized = ref({
  title: t("buttons.updateQuote"),
  fieldsToUpload: [],
  inputs: [
    {
      type: "text",
      label: t("entities.fields.title"),
      name: "title",
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
      type: "html",
      label: t("entities.fields.description"),
      name: "description",
      required: true,
      error: "",
      value: "",
    },
    {
      type: "textarea",
      label: t("entities.fields.answer_description"),
      name: "answer_description",
      value: "",
      required: true,
      error: "",
      validator: validateString
    },
    {
      type: "textarea",
      label: t("entities.fields.intro_description"),
      name: "intro_description",
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
  apiBaseUrl: "/admin/manage/blog",
  identifier: "id",
});
const links = ref([
  {
    name: t("links.topLinks.blogManagement"),
    path: "/dashboard/blog",
  },
  {
    name: t("links.topLinks.blogs"),
    path: "/dashboard/blog/blog",
  },
]);
watch(
  () => data.value.id,
  async () => {
    links.value.push(
      {
        name: data.value.title ? data.value.title : data.value.slug,
        path: `/dashboard/blog/blog/${route.params.blogId}`,
      },
    )
  }
);

const blogSlideFields = ref([
  {
    title: t("links.blogRelatedBlog.title"),
    field: "related_blogs",
    apiBaseUrl: "/admin/manage/blog/blog-related-blog",
    identifier: "id",
    imageField: "image_url",
    textField: {
      default: "name",
      alt: "slug"
    },
    preDefined: {
      blog_id: route.params.blogId
    },
    inputs: [
      {
        type: "table",
        label: t("entities.fields.blog"),
        name: "related_blog_id",
        value: "",
        required: false,
        error: "",
        options: {
          identifier: "id",
          dataResult: "result",
          dataCountResult: "totalCount",
          selectedFieldKey: "title",
          previewUrl: "/dashboard/blog/blog/{{ID}}",
          // singleRecordUrl: `/dashboard/log/${route.params.logCategoryId}/`,
          apiBaseUrl: "/admin/manage/blog",
          baseUrl: "",
          pageSize: 5,
          filterInputs: [
            {
              type: "text",
              label: t("entities.fields.title"),
              name: "title",
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
              type: "table",
              label: t("entities.fields.category"),
              name: "blog_category_id",
              value: "",
              required: false,
              error: "",
              options: {
                identifier: "id",
                dataResult: "result",
                previewUrl: "/dashboard/blog/category/{{ID}}",
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
                apiBaseUrl: "/admin/manage/blog/blog-category",
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
            },
            {
              type: "table",
              label: t("entities.fields.tag"),
              name: "tag_included",
              value: "",
              required: false,
              error: "",
              options: {
                identifier: "id",
                dataResult: "result",
                dataCountResult: "totalCount",
                previewUrl: "/dashboard/blog/tag/{{ID}}",
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
                apiBaseUrl: "/admin/manage/blog/blog-tag",
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
          preDefined: {
            id: route.params.blogId,
            blog_not_related_to_blog: route.params.blogId
          },
          visibleFields: [
            {
              value: t("entities.fields.title"),
              key: "title",
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
    title: t("links.blogSuggestedProduct.title"),
    field: "suggested_products",
    apiBaseUrl: "/admin/manage/blog/blog-product",
    identifier: "id",
    imageField: "image_url",
    textField: {
      default: "name",
      alt: "slug"
    },
    preDefined: {
      blog_id: route.params.blogId
    },
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
          apiBaseUrl: "/admin/manage/product/product",
          previewUrl: "/dashboard/product/product/{{ID}}",
          baseUrl: "",
          pageSize: 5,
          preDefined: {
            product_not_attached_to_blog: route.params.blogId,
          },
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
                    value: 0,
                  },
                  {
                    name: t("entities.values.published.false"),
                    value: 1,
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
          ],
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
    title: t("links.blogBlogTag.title"),
    field: "tags",
    apiBaseUrl: "/admin/manage/blog/blog-tag-blog",
    identifier: "id",
    imageField: "icon_url",
    textField: {
      default: "name",
      alt: "slug"
    },
    preDefined: {
      blog_id: route.params.blogId
    },
    inputs: [
      {
        type: "table",
        label: t("entities.fields.blog_tag"),
        name: "blog_tag_id",
        value: "",
        required: false,
        error: "",
        options: {
          previewUrl: "/dashboard/blog/tag/{{ID}}",
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
          identifier: "id",
          dataResult: "result",
          dataCountResult: "totalCount",
          selectedFieldKey: "name",
          apiBaseUrl: "/admin/manage/blog/blog-tag",
          baseUrl: "",
          pageSize: 5,
          preDefined: {
            tag_not_attached_to_blog: route.params.blogId,
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
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/blog/blog`"
      :editBasicFields="edit"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/blog"
      :identifier="`${route.params.blogId}`"
      :slideFields="blogSlideFields"
      tableName="blog"
    >
      <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          :title="t('links.blogBlogCategory.title')"
          :description="t('links.blogBlogCategory.description')"
          :to="`/dashboard/blog/category/${data.blog_category_id}`"
        >
          <span class="material-icon i-xs round">category</span>
        </AdminModulesManageButton>
        <!-- <AdminModulesManageButton
          :title="t('links.blogBlogTag.title')"
          :description="t('links.blogBlogTag.description')"
          :to="`/dashboard/blog/blog/${route.params.blogId}/tag`"
        >
          <span class="material-icon i-xs round">tag</span>
        </AdminModulesManageButton> -->
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
