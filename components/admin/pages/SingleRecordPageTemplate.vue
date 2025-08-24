<script setup lang="ts">
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";
const { locales, t, locale } = useI18n() as any;

type ICarousel = {
  field: string;
  imageSize?: {
    width: string
    height: string
  }
  localized?: boolean;
  imageField?: string;
  textField?: string | {default: string, alt: string}
  apiBaseUrl: string
  identifier: string
  preDefined?: any
  inputs: any
}
type ISlideField = {
  title: string;
  field: string;
  imageSize?: {
    width: string
    height: string
  }
  imageField?: string;
  textField?: string | {default: string, alt: string}
  apiBaseUrl: string
  identifier: string
  preDefined?: any
  inputs: any
}

// * props
const props = defineProps<{
  editBasicFields?: any;
  editLocalizedFields?: any;
  baseURL: any;
  token?: string;
  identifier: string;
  callBackUrl: string;
  logUrl?: string;
  tableName: string;
  disableDelete?: boolean;
  preDefinedRecord?: any;
  carousel?: ICarousel;
  slideFields?: ISlideField[]
}>();

const record = ref(null) as any;

// * async data
const adminStore = useAdminStore();
onMounted(async () => {
  try {
    if (props.editBasicFields) {
      await adminStore.getData({
        token: props.token,
        url: `${props.baseURL}/${props.identifier}`,
        query: "",
        loading: true,
        lang: locale.value,
        dataResult: "",
      });
      record.value = adminStore.data;
    } else {
      await adminStore.getLocales({
        token: props.token,
        url: `${props.baseURL}/${props.identifier}`,
        lang: locale.value,
        loading: true,
        dataResult: "",
      });
      record.value = adminStore.data;
    }
    if (props.preDefinedRecord) {
      record.value = {
        ...record.value,
        ...props.preDefinedRecord,
      };
    }
  } catch (error: any) {
    switch (error.message) {
      case "404":
        runTimeError.value = "404";
        break;
      case "429":
        runTimeError.value = "429";
        break;
      case "500":
        runTimeError.value = "500";
        break;
      case "403":
        runTimeError.value = "403";
        break;

      default:
        break;
    }
    console.log("🚀 ~ file: MultiRecordPageTemplate.vue:539 ~ onMounted ~ error", error);
    // throw error;
  }
});

const localePath = useLocalePath();

// record

// * data
const runTimeError = ref(null) as any;
const editBasicFieldsActions = ref({
  edit: props.editBasicFields,
  identifier: props.identifier,
});
const deleteActions = ref({
  apiBaseUrl: props.baseURL,
  callBackUrl: props.callBackUrl,
  identifier: props.identifier,
});

const editLocalizedFieldsActions = ref({
  edit: props.editLocalizedFields,
  identifier: props.identifier,
});

function createGetRecordOptions(lang: string): any {
  return {
    url: `${props.baseURL}/${props.identifier}/locale`,
    query: "",
    lang,
  };
}
async function goToLogPage() {
  const query = {
    row_id: record.value.id,
    table_name: `${props.tableName},${props.tableName}_localized_info`,
  };
  await navigateTo({
    path: localePath("/dashboard/log"),
    query,
  });
}

function localeExists(locale: string): boolean {
  return record?.value?.localized_in?.some((item: any) => {
    return item.locale == locale;
  });
}
</script>

<template>
  <div>
    <div v-if="adminStore.getLoading">
      {{t("forms.general.loading.title")}}
    </div>
    <div v-else-if="runTimeError">
      <AdminPagesErrorLoader :code="runTimeError" />
    </div>
    <div v-else>
      <div  v-if="carousel && carousel.field && record && record[carousel.field] && Array.isArray(record[carousel.field])" >
        <h1 class="page-heading">{{ t("forms.editCarousel.heading") }}</h1>
        <AdminModulesManageCarousel 
          :carousel="carousel"
          :slides="record[carousel.field]"
        />
      </div>
      <h1 class="page-heading">{{ t("forms.editBasicFields.heading") }}</h1>
      <div class="page-buttons">
        <AdminModulesManageButton
          v-if="props.editBasicFields && props.editBasicFields.inputs && props.editBasicFields.inputs.length"
          :title="t('forms.editBasicFields.title')"
          :description="t('forms.editBasicFields.description')"
          :actions="editBasicFieldsActions"
          :record="record"
        >
          <span class="material-icon i-xs round">edit</span>
        </AdminModulesManageButton>
        <AdminModulesManageButton
          :title="t('buttons.logs.title')"
          :description="t('buttons.logs.description')"
          @click="goToLogPage()"
        >
          <span class="material-icon i-xs round">history</span>
        </AdminModulesManageButton>
        <AdminModulesManageButton
          :title="t('buttons.delete.title')"
          :description="t('buttons.delete.description')"
          v-if="!disableDelete"
          :actions="{
            delete: deleteActions,
          }"
        >
          <span class="material-icon i-xs round">delete</span>
        </AdminModulesManageButton>
      </div>
      <h1 v-if="editLocalizedFields" class="page-heading">{{ t("forms.editLocalizedFields.heading") }}</h1>
      <div v-if="editLocalizedFields" class="page-buttons">
        <div v-if="locales.length" v-for="(lang, index) in locales" :key="index">
          <AdminModulesManageButton
            v-if="localeExists(lang.code)"
            :title="lang.displayName"
            :description="t('forms.editLocalizedFields.description')"
            :actions="editLocalizedFieldsActions"
            :passedLocale="lang.code"
            :getRecordOptions="createGetRecordOptions(lang.code)"
            :locale="true"
          >
            <span class="material-icon i-xs round">edit</span>
          </AdminModulesManageButton>
          <AdminModulesManageButton
            v-else
            :title="lang.displayName"
            :description="t('forms.createLocalizedFields.description')"
            :actions="editLocalizedFieldsActions"
            :passedLocale="lang.code"
            :record="record"
            :locale="true"
            :getRecordOptions="createGetRecordOptions(lang.code)"
            :create="true"
          >
            <span class="material-icon i-xs round">add</span>
          </AdminModulesManageButton>
        </div>
      </div>
      <div v-for="slide in slideFields">
        <div  v-if="slide && slide.field && record && record[slide.field] && Array.isArray(record[slide.field])" >
          <h1 class="page-heading">{{ slide.title }}</h1>
          <AdminModulesManageCarousel 
            :carousel="slide"
            :slides="record[slide.field]"
          />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .small-text{
    font-size: .5em;
  }
</style>