<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});
const route = useRoute();
useHead({
  title: `Admin | ${route.params.id} Page Management`,
});

const { t } = useI18n();


const {
  makeValidateString,
  validateDescription,
  makeValidateUrl
} = useValidators()

const validateString = makeValidateString()

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
      type: "textarea",
      label: t("entities.fields.description"),
      name: "description",
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
      type: "filePicker",
      label: t("entities.fields.image_url"),
      name: "image_url",
      required: true,
      error: "",
      options: {
        imageFormats: ["image/png", "image/jpeg", "image/gif"],
        allowedFormats: ["image/png", "image/jpeg", "image/gif"],
      },
    },
  ],
  apiBaseUrl: `/admin/manage/page`,
  identifier: "id",
});
const preDefinedRecord = {
  id: route.params.id,
};
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.pages"),
    path: "/dashboard/pages",
  },
  {
    name: t(`links.topLinks.${route.params.id}Page`),
    path: "/dashboard/pages/home",
  },
]);

const pageCarousel = ref({
  field: "slides",
  apiBaseUrl: "/admin/manage/page-slide",
  identifier: "id",
  imageField: "image_url",
  localized: true,
  // textField: "url",
  preDefined: {
    page_id: route.params.id
  },
  inputs: [
    {
      type: "text",
      label: t("entities.fields.url"),
      name: "url",
      options: {
        mode: "url",
        alwaysLtr: "true"
      },
      value: "",
      required: true,
      error: "",
      validator: makeValidateUrl(true)
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
const {
  public: {
    pages
  }
} = useRuntimeConfig()
const {carousel, banners, links:pageLinks}:any = pages.filter((page:any) => {
  return page.name == route.params.id
})[0]
const pageSlides = ref([]) as any

if (banners) {
    pageSlides.value.push({
      title: t("links.pageBanners.title"),
      field: "banners",
      apiBaseUrl: "/admin/manage/page-banner",
      identifier: "id",
      imageField: "image_url",
      localized: true,
      // textField: "url",
      preDefined: {
        page_id: route.params.id
      },
      inputs: [
        {
          type: "text",
          label: t("entities.fields.url"),
          name: "url",
          options: {
            mode: "url",
            alwaysLtr: "true"
          },
          value: "",
          required: true,
          error: "",
          validator: makeValidateUrl(true)
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
}

</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesSingleRecordPageTemplate
      :callBackUrl="`/dashboard/page`"
      :editBasicFields="{}"
      :editLocalizedFields="editLocalized"
      baseURL="/admin/manage/page"
      :carousel="carousel ? pageCarousel : undefined"
      :identifier="(route.params.id as string)"
      tableName="page"
      :slideFields="pageSlides"
      disableDelete
      :preDefinedRecord="preDefinedRecord"
    >
      <div v-if="pageLinks && pageLinks.length">
        <h1 class="page-heading">{{ t("links.adminTokens.heading") }}</h1>
        <div class="page-buttons">
          <AdminModulesManageButton
            v-for="pageLink in pageLinks"
            :title="t(`links.${pageLink.name}.title`)"
            :description="t(`links.${pageLink.name}.description`)"
            :to="pageLink.url"
          >
            <div v-html="pageLink.icon">
            </div>
          </AdminModulesManageButton>
        </div>
      </div>
    </AdminPagesSingleRecordPageTemplate>
  </div>
</template>
