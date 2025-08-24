<script setup lang="ts">
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";
const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const AdminFormMultiPageForm = resolveComponent("AdminFormMultiPageForm");
const AdminFormSinglePageForm = resolveComponent("AdminFormSinglePageForm");
// * define emits and props
const props = defineProps<{
  label: string;
  name: string;
  error: string;
  modelValue: any;
  options: any;
  placeholder?: string;
}>();

const emit = defineEmits(["error", "update:modelValue", "secondFieldBind"]);

const adminStore = useAdminStore();
const { inputDataPages, inputMultiData: records } = storeToRefs(adminStore) as any;

// * data
const currentPage = ref(1);
const showTableFilter = ref(false);
const barIsOpen = ref(false);
const Filters = ref({}) as any;
const selectedItem = ref("");
const selectedSecondField = ref("")

// *;

async function getRecords() {
  try {
    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.options.pageSize,
      dataResult: props.options.dataResult,
      dataCountResult: props.options.dataCountResult,
      preDefined: props.options.preDefined,
      url: props.options.apiBaseUrl,
      pageNumber: 1,
      query: route.query,
      getForInput: true,
    });
  } catch (error) {
    console.log("🚀 ~ file: MultiRecordPageTemplate.vue:539 ~ onMounted ~ error", error);
    // throw error;
  }
}

// * functions
async function toggle() {
  Filters.value = {};
  if (!barIsOpen.value) {
    await getRecords();
  }
  barIsOpen.value = !barIsOpen.value;
}

function askToShowFilters() {
  // scrollTo({ top: 0,
  const yo = document.getElementsByClassName("admin-page-modal")[0];
  yo.scrollTo({ top: 0 });
  showTableFilter.value = true;
}

function getUrl (){
  if(props.options.previewUrl){
    return props.options.previewUrl.replace('{{ID}}', props.modelValue)
  }else {
    return props.modelValue
  }
}

async function submitFilters(filters: any) {
  try {
    let query = {} as any;
    for (let i = 0; i < props.options.filterInputs.length; i++) {
      const filterInput = props.options.filterInputs[i];
      if (filters[filterInput.name]) {
        query[filterInput.name] = filters[filterInput.name];
      }
    }
    showTableFilter.value = false;
    currentPage.value = 1;
    await adminStore.getMultiData({
      lang: locale.value,
      dataResult: props.options.dataResult,
      dataCountResult: props.options.dataCountResult,
      preDefined: props.options.preDefined,
      url: props.options.apiBaseUrl,
      pageSize: props.options.pageSize,
      pageNumber: currentPage.value,
      query,
      getForInput: true,
    });
    Filters.value = query;
  } catch (error: any) {
    throw new Error(t("useCases.errors.general.unExpected"));
  }
}

async function SelectRecord(record: any) {
  emit("error", "");
  Filters.value = {};
  barIsOpen.value = false;
  selectedItem.value = record[props.options.selectedFieldKey];
  if (props.options?.secondFieldBind?.key) {
    emit("secondFieldBind", record[props.options.secondFieldBind.key]);
  }
  emit("update:modelValue", record[props.options.identifier]);
}

function filtersAreApplied() {
  for (let i = 0; i < props.options.filterInputs.length; i++) {
    const filterInput = props.options.filterInputs[i];
    if (Filters.value[filterInput.name]) {
      props.options.filterInputs[i].value = Filters.value[filterInput.name];
      return true;
    }
  }
  return false;
}
async function clearFilters() {
  try {
    for (let i = 0; i < props.options.filterInputs.length; i++) {
      props.options.filterInputs[i].value = "";
    }
    currentPage.value = 1;

    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.options.pageSize,
      dataResult: props.options.dataResult,
      dataCountResult: props.options.dataCountResult,
      preDefined: props.options.preDefined,
      url: props.options.apiBaseUrl,
      pageNumber: currentPage.value,
      query: {},
      getForInput: true,
    });
    Filters.value = {};
  } catch (error) {
    throw error;
  }
}
function getFieldValue(recordSelectedToDelete: any, field: any) {
  if (field._constructor) {
    return field._constructor(recordSelectedToDelete[field.key]);
  }
  return recordSelectedToDelete[field.key];
}
async function loadMoreData() {
  try {
    // let url = "";
    // for (let i = 0; i < Object.keys(route.query).length; i++) {
    //   const filterInputName = Object.keys(route.query)[i];
    //   if (route.query[filterInputName]) {
    //     if (i !== 0) {
    //       url += `&`;
    //     }
    //     url += `${filterInputName}=${route.query[filterInputName]}`;
    //   }
    // }
    currentPage.value++;
    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.options.pageSize,
      dataResult: props.options.dataResult,
      keepOldData: true,
      dataCountResult: props.options.dataCountResult,
      preDefined: props.options.preDefined,
      url: props.options.apiBaseUrl,
      pageNumber: currentPage.value,
      query: route.query,
      getForInput: true,
    });
  } catch (err: any) {
    console.log(err);
  }
}
</script>

<template>
  <div class="table-input-wrapper">
    <div class="table-input-container">
    {{ selectedSecondField }}
      <label @click="toggle" :class="['table-input-label', error ? 'red-label' : '']">{{
        label
      }}</label>
      <button
        type="button"
        :class="['select-table', error ? 'select-table-error' : '']"
        @click="toggle"
      >
        <span v-if="selectedItem">{{ selectedItem }}</span>
        <nuxt-link v-else-if="modelValue" :href="getUrl()" target="_blank">{{
          t("forms.general.label.selectedTablePreview")
        }}</nuxt-link>
        <span v-else>{{ placeholder }}</span>
      </button>
    </div>
    <div v-if="barIsOpen" class="user-management-page-wrapper active">
      <AdminModal
        v-if="showTableFilter"
        :dialogueTitle="t('buttons.advancedSearch')"
        @close="showTableFilter = false"
        parentClass="admin-page-modal"
      >
        <div class="inputs">
          <component
            :is="
              Array.isArray(options.filterInputs) &&
              options.filterInputs.length &&
              options.filterInputs[0] &&
              options.filterInputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            parentClass="admin-page-modal"
            :inputPages="options.filterInputs"
            :inputs="options.filterInputs"
            :submitFunction="submitFilters"
          />
        </div>
      </AdminModal>
      <div class="control-buttons-wrapper">
        <client-only>
          <button
            type="button"
            class="delete-filters-span-button"
            v-if="options.filterInputs && filtersAreApplied()"
            @click="clearFilters"
          >
            <p>{{ t("buttons.clearFilters") }}</p>
            <span class="material-icon round i-xs" disabled>clear</span>
          </button>
        </client-only>
        <button
          type="button"
          class="add-user-control-button filter"
          v-if="options.filterInputs"
          @click="askToShowFilters"
        >
          <div class="add-icon-wrapper">
            <span class="material-icon round i-xs" disabled>tune</span>
          </div>
          <p class="add-message">{{ t("buttons.advancedSearch") }}</p>
        </button>
      </div>

      <client-only>
        <table>
          <thead>
            <th v-for="(field, index) in options.visibleFields" :key="index">
              {{ field.value }}
            </th>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td
                v-for="(field, index) in options.visibleFields"
                :key="index"
                @click.self="SelectRecord(record)"
              >
                <span v-if="field.type === 'boolean'" @click.self="SelectRecord(record)">
                  <span
                    v-if="getFieldValue(record, field) == true"
                    class="material-icon round i-xs no-cursor"
                    >check</span
                  >
                  <span v-else class="material-icon round i-xs no-cursor">close</span>
                </span>
                <span v-else-if="field.type === 'image'">
                  <a
                    v-if="getFieldValue(record, field)"
                    class="material-icon round i-xs image-previe-button"
                    :href="getFieldValue(record, field)"
                    target="_blank"
                  >
                    image
                  </a>
                  <span
                    v-if="!getFieldValue(record, field)"
                    class="material-icon round i-xs no-cursor"
                    >close</span
                  >
                </span>
                <span v-else @click.self="SelectRecord(record)">
                  {{ getFieldValue(record, field) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </client-only>
      <div>
        <button
          type="button"
          class="infinite-scroll-button"
          @click="loadMoreData"
          v-if="currentPage < inputDataPages.length"
        >
          {{ t("buttons.loadMore") }}
        </button>
        <button type="button" class="infinite-scroll-button disabled" v-else disabled>
          {{ t("buttons.loadMore") }}
        </button>
      </div>
    </div>
    <p class="error-description" v-if="error">{{ error }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
@import "@/assets/scss/admin/form";

</style>
