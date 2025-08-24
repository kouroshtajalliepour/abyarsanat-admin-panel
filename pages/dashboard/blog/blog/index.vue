<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * validation

useHead({
  title: "Admin | Blog  Management",
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
  url: '/admin/manage/blog',
  locale: locale.value,
  token
})

const blogsCreate = ref({
  title: t("pages.blogManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {},
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
          type: "boolean",
          label: t("entities.fields.published"),
          name: "published",
          value: false,
          error: "",
        },
      ]
    },
    {
      title: t("entities.fields.description"),
      inputs: [
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
      ]
    },
    {
      title: t("entities.fields.image_url"),
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
          label: t("entities.fields.category"),
          previewUrl: "/dashboard/blog/category/{{ID}}",
          name: "blog_category_id",
          value: "",
          required: false,
          error: "",
          options: {
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
      ]
    },
    
  ],
});
const blogsGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/blog/blog/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.title"),
      key: "title",
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
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="blogsGet"
      tableName="blog"
      :create="blogsCreate"
      apiBaseUrl="/admin/manage/blog"
      :baseUrl="`/dashboard/blog/blog`"
      :singlePageIncluded="true"
      :pagination="true"
      :useCSRFToken="true"
      :pageSize="10"
    />
  </div>
</template>

<style></style>
