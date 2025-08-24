<script setup lang="ts">
// * imports
// * imports
import SvgRadio from "@/components/Svg/radio.vue";
import SvgCheckBox from "@/components/Svg/checkBox.vue";
import SvgActiveRadio from "@/components/Svg/activeRadio.vue";
import SvgActiveCheckBox from "@/components/Svg/activeCheckBox.vue";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
import moment from "jalali-moment";
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();
// * defining data

const AdminFormMultiPageForm = resolveComponent("AdminFormMultiPageForm");
const AdminFormSinglePageForm = resolveComponent("AdminFormSinglePageForm");

const showFiltersForm = ref(false);
const showSelectActionMenu = ref(false);
const recordSelectedToDelete: any = ref(null);
const recordSelectedToUpdate: any = ref(null);
const selectedExtraAction: any = ref(null);
const askedToCreate = ref(false);
const recordSelectedForExtraAction: any = ref(null);
const runTimeError = ref(null) as any;
const currentPage = ref(1);
const deleteInputs: any = ref([
  {
    type: "text",
    label: t("forms.deleteConfirmation"),
    name: "confirmation",
    value: "",
    required: true,
    error: "",
    options: {},
  },
]);

// * defining store
const adminStore = useAdminStore();
const {
  loadedAt,
  recordsFound,
  dataPages,
  multiData: records,
  getLoading,
  imagePreview,
} = storeToRefs(adminStore) as any;

// * props & emit defenitions
const emit = defineEmits(["toPreviousPage", "goNextPage"]);
const langToCreate = ref(null) as any;
const showFilOutput = ref(false) as any;
const selectedRecords = ref([]) as any;

const props = defineProps<{
  get: any;
  getFile?: any;
  create?: any;
  update?: any;
  Delete?: any;
  baseUrl: string;
  apiBaseUrl: string;
  disableFileOutput?: boolean;
  pagination: boolean;
  pageSize: number;
  singlePageIncluded: boolean;
  extraActions?: any;
  selectAction?: {
    title: string;
    button?: {
      title: string;
      icon: string;
    };
    validateRecord?: (args: any) => any;
    submitFunction: (inputs: any, records: string[]) => any;
    inputs: any;
    identifier: string;
  };
  updateFieldsToUpload?: any;
  useCSRFToken?: boolean;
  tableName: string;
  hideLogs?: boolean;
}>();

// * functions

const { locales } = useI18n();

function getLangsAsOptions() {
  const options = [];
  for (let i = 0; i < locales.value.length; i++) {
    const locale: any = locales.value[i];

    options.push({
      name: locale.displayName,
      value: locale.code,
    });
  }
  return options;
}

async function askToUpdate(record: any) {
  for (let i = 0; i < props.update.inputs.length; i++) {
    const input = props.update.inputs[i];
    input.value = undefined;
    if (record[input.name]) {
      input.value = record[input.name];
    }
    if (input.fieldToExtractFrom) {
      if (input.fieldToExtractFrom === "self") {
        input.value = record;
      } else {
        input.value = record[input.fieldToExtractFrom];
      }
    }
  }
  recordSelectedToUpdate.value = record;
}
function openExtraActionForm(action: any, record: any) {
  selectedExtraAction.value = action;
  if (!selectedExtraAction.value.inputs) {
    selectedExtraAction.value.inputs = [];
  }
  for (let i = 0; i < selectedExtraAction.value.inputs.length; i++) {
    const input = selectedExtraAction.value.inputs[i];
    if (record[input.name]) {
      input.value = record[input.name];
    }
  }
  recordSelectedForExtraAction.value = record;
}

async function handleExtraAction(passedData: any) {
  try {
    await selectedExtraAction.value.submitFunction(
      passedData,
      recordSelectedForExtraAction.value
    );
  } catch (error) {
    throw error;
  }
}
async function submitEdit(data: any) {
  try {
    const submitFunction = props.update.submitFunction;
    if (submitFunction) {
      recordSelectedToUpdate.value = await submitFunction(data);
    } else {
      const updatedRecord = await adminStore.updateData({
        data,
        lang: locale.value,
        useCsrf: props.useCSRFToken,
        identifier: recordSelectedToUpdate.value[props.update.identifier],
        dataResult: props.update.dataResult,
        url: props.apiBaseUrl,
        fieldsToUpload: [...new Set(props.updateFieldsToUpload)],
      });
      location.reload();
    }
    recordSelectedToUpdate.value = null;
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes("entities") || error.message.includes("useCases"))
    ) {
      throw new Error(t(error.message));
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}
async function deleteRecord(data: any) {
  if (data.confirmation != t("forms.deleteConfirmation")) {
    return;
  }
  try {
    const submitFunction = props.Delete.submitFunction;
    if (submitFunction) {
      recordSelectedToDelete.value = await submitFunction(data);
    } else {
      const url = props.Delete.baseUrl ? props.Delete.baseUrl : props.apiBaseUrl;
      await adminStore.deleteData({
        lang: locale.value,
        dontPassLang: props.Delete.dontPassLang,
        useCsrf: props.useCSRFToken,
        identifier: recordSelectedToDelete.value[props.Delete.identifier],
        url,
      });
    }
    location.reload();
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes("entities") || error.message.includes("useCases"))
    ) {
      throw new Error(t(error.message));
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}
async function submitGetFileOutput(data: any) {
  if (data.confirmation != t("forms.deleteConfirmation")) {
    return;
  }
  try {
    // * fix
    await adminStore.getFileOutput({
      lang: locale.value,
      pageSize: props.pageSize,
      dataResult: props.getFile?.dataResult
        ? props.getFile?.dataResult
        : props.get.dataResult,
      dataCountResult: props.getFile?.dataCountResult
        ? props.getFile?.dataCountResult
        : props.get.dataCountResult,
      preDefined: props.getFile?.preDefined
        ? props.getFile?.preDefined
        : props.get.preDefined,
      url: props.getFile?.apiBaseUrl ? props.getFile?.apiBaseUrl : props.apiBaseUrl,
      query: props.getFile?.apiBaseUrl ? {} : route.query,
    });

    showFilOutput.value = false;
  } catch (error: any) {
    console.log(
      "🚀 ~ file: MultiRecordPageTemplate.vue:216 ~ submitGetFileOutput ~ error:",
      error
    );
    if (
      error.message &&
      (error.message.includes("entities") || error.message.includes("useCases"))
    ) {
      throw new Error(t(error.message));
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}
function goToSingleRecordPage(id: any) {
  if (props.singlePageIncluded && props.get.singleRecordUrl) {
    navigateTo(localePath(`${props.get.singleRecordUrl}${id}`));
  }
}
function getFieldValue(recordSelectedToDelete: any, field: any) {
  if (field._constructor) {
    return field._constructor(recordSelectedToDelete[field.key]);
  }
  return recordSelectedToDelete[field.key];
}
function filtersAreApplied() {
  for (let i = 0; i < props.get.filterInputs.length; i++) {
    const filterInput = props.get.filterInputs[i];
    if (route.query[filterInput.name]) {
      props.get.filterInputs[i].value = route.query[filterInput.name];
      return true;
    }
  }
  return false;
}
async function submitFilters(filters: any) {
  try {
    let query = {} as any;
    for (let i = 0; i < props.get.filterInputs.length; i++) {
      const filterInput = props.get.filterInputs[i];
      if (filters[filterInput.name]) {
        query[filterInput.name] = filters[filterInput.name];
      }
    }
    showFiltersForm.value = false;
    currentPage.value = 1;
    await adminStore.getMultiData({
      lang: locale.value,
      dataResult: props.get.dataResult,
      dataCountResult: props.get.dataCountResult,
      preDefined: props.get.preDefined,
      url: props.apiBaseUrl,
      pageSize: props.pageSize,
      pageNumber: currentPage.value,
      query,
    });
    await navigateTo({
      path: localePath(props.baseUrl),
      query,
    });
  } catch (error: any) {
    throw new Error(t("useCases.errors.general.unExpected"));
  }
}
function showCreate() {
  if (props.create.to) {
    navigateTo(localePath(props.create.to));
    return;
  }
  askedToCreate.value = true;
}
async function loadMoreData() {
  try {
    currentPage.value++;

    const query = { ...route.query };
    if (!query.created_at) {
      query.created_at = `1990,${moment(loadedAt.value).format("YYYY-MM-DD HH:MM")}`;
    } else if (
      typeof query.created_at === "string" &&
      query.created_at.split(",").length < 2
    ) {
      query.created_at = `${query.created_at},${moment(loadedAt.value).format(
        "YYYY-MM-DD HH:MM"
      )}`;
    }
    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.pageSize,
      dataResult: props.get.dataResult,
      keepOldData: true,
      dataCountResult: props.get.dataCountResult,
      preDefined: props.get.preDefined,
      url: props.apiBaseUrl,
      pageNumber: currentPage.value,
      query: route.query,
    });
  } catch (err: any) {
    console.log(err);
  }
}
async function clearFilters() {
  try {
    for (let i = 0; i < props.get.filterInputs.length; i++) {
      props.get.filterInputs[i].value = "";
    }
    currentPage.value = 1;

    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.pageSize,
      dataResult: props.get.dataResult,
      dataCountResult: props.get.dataCountResult,
      preDefined: props.get.preDefined,
      url: props.apiBaseUrl,
      pageNumber: currentPage.value,
      query: {},
    });
    navigateTo(localePath(props.baseUrl));
  } catch (error) {
    throw error;
  }
}
function openImage(value: string) {
  imagePreview.value = value;
}
async function goToLogPage() {
  const query = {
    table_name: `${props.tableName},${props.tableName}_localized_info`,
  };
  await navigateTo({
    path: localePath("/dashboard/log"),
    query,
  });
}
async function createRecord(data: any) {
  if (props.create.notToAskForLanguage && !langToCreate.value) {
    throw new Error(t("forms.general.error.langIsRequired"));
  }

  try {
    if (!props.create.submitFunction) {
      const createdRecord: any = await adminStore.createData({
        data,
        lang: langToCreate.value,
        dataResult: props.create.dataResult,
        url: props.apiBaseUrl,
        fieldsToUpload: props.create.fieldsToUpload,
        preDefined: props.create.preDefined,
        useCsrf: props.useCSRFToken,
      });
      if (props.singlePageIncluded) {
        if (props.create.dataResult) {
          goToSingleRecordPage(
            createdRecord[props.create.dataResult][props.get.identifier]
          );
        } else {
          goToSingleRecordPage(createdRecord[props.get.identifier]);
        }
      }
      location.reload();
    } else {
      const result: string = await props.create.submitFunction(data);
      goToSingleRecordPage(result);
    }
  } catch (error: any) {
    if (
      error.message &&
      (error.message.includes("entities") || error.message.includes("useCases"))
    ) {
      throw new Error(t(error.message));
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}

async function selectActionSubmit(data: any) {
  try {
    await props.selectAction?.submitFunction(data, selectedRecords.value);
    showFiltersForm.value = false;
    location.reload();
  } catch (error: any) {
    throw error;
  }
}

function allRecordsAreSelected() {
  const selectAbleRecords = props.selectAction?.validateRecord
    ? records.value.filter((item: any) => {
        if (props.selectAction?.validateRecord) {
          return !props.selectAction?.validateRecord(item);
        }
      })
    : records.value;

  return (
    selectAbleRecords.length && selectedRecords.value.length === selectAbleRecords.length
  );
}

function handleSelectAll() {
  if (allRecordsAreSelected()) {
    selectedRecords.value = [];
  } else {
    const selectAbleRecords = props.selectAction?.validateRecord
      ? records.value.filter((item: any) => {
          if (props.selectAction?.validateRecord) {
            return !props.selectAction?.validateRecord(item);
          }
        })
      : records.value;
    selectedRecords.value = selectAbleRecords.map(
      (item: any) =>
        item[props.selectAction?.identifier ? props.selectAction.identifier : "id"]
    );
  }
}
onMounted(async () => {
  try {
    let pageNumber;
    if (props.pagination) {
      pageNumber = currentPage.value;
    }

    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: props.pageSize,
      dataResult: props.get.dataResult,
      dataCountResult: props.get.dataCountResult,
      preDefined: props.get.preDefined,
      url: props.apiBaseUrl,
      pageNumber,
      query: route.query,
    });
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
    // throw error;
  }
});
function getFormDirection() {
  const L = locales.value.filter((l: any) => {
    return l.code === langToCreate.value;
  })[0] as any;
  if (!L || !L.dir) {
    return null;
  }
  return L.dir;
}

const fileOutputInputs = ref([
  {
    type: "text",
    label: t("forms.deleteConfirmation"),
    name: "confirmation",
    value: "",
    required: true,
    error: "",
    options: {},
  },
]) as any;
</script>

<template>
  <div>
    <!-- todo: disable to debug -->
    <div v-if="getLoading">
      <AdminPagesMultiRecordPageLoading
        :pageSize="pageSize"
        :showFilterButton="get.filterInputs && get.filterInputs.length"
        :showCreateButton="create"
        :showLogsButton="!hideLogs"
        :showDownloadButton="!disableFileOutput"
        :showPaginationButton="pagination"
      />
    </div>
    <div v-else-if="runTimeError">
      <AdminPagesErrorLoader :code="runTimeError" />
    </div>
    <div v-else>
      <AdminModal
        v-if="showFiltersForm"
        :dialogueTitle="t('buttons.advancedSearch')"
        @close="showFiltersForm = false"
      >
        <div class="inputs">
          <component
            :is="
              Array.isArray(get.filterInputs) &&
              get.filterInputs.length &&
              get.filterInputs[0] &&
              get.filterInputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="get.filterInputs"
            :inputs="get.filterInputs"
            :submitFunction="submitFilters"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="showSelectActionMenu && selectAction"
        :dialogueTitle="selectAction.title"
        @close="showSelectActionMenu = false"
      >
        <div class="inputs">
          <component
            :is="
              Array.isArray(selectAction?.inputs) &&
              selectAction?.inputs.length &&
              selectAction?.inputs[0] &&
              selectAction?.inputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="selectAction?.inputs"
            :inputs="selectAction?.inputs"
            :submitFunction="selectActionSubmit"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="askedToCreate"
        :dialogueTitle="create?.title"
        @close="
          askedToCreate = false;
          langToCreate = null;
        "
      >
        <div v-if="create && create.inputs" class="inputs">
          <AdminFormInputsComboBox
            :label="t('forms.general.label.langSelection')"
            v-model="langToCreate"
            v-if="!create.notToAskForLanguage"
            name="create-lang-selection"
            :options="{
              options: getLangsAsOptions(),
              nameKey: 'name',
              valueKey: 'value',
            }"
          />
          <h3>{{ create.description }}</h3>
          <component
            :is="
              Array.isArray(create.inputs) &&
              create.inputs.length &&
              create.inputs[0] &&
              create.inputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :direction="getFormDirection()"
            :inputPages="create.inputs"
            :inputs="create.inputs"
            :submitFunction="createRecord"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="recordSelectedToUpdate"
        :dialogueTitle="update.title"
        @close="recordSelectedToUpdate = null"
      >
        <div v-if="update && update.inputs" class="inputs">
          <h3>{{ update.description }}</h3>
          <component
            :is="
              Array.isArray(update.inputs) &&
              update.inputs.length &&
              update.inputs[0] &&
              update.inputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="update.inputs"
            :inputs="update.inputs"
            :submitFunction="submitEdit"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="recordSelectedToDelete"
        :dialogueTitle="Delete.title"
        @close="recordSelectedToDelete = null"
      >
        <div v-if="Delete" class="inputs">
          <h3>{{ t("forms.general.heading.delete") }}</h3>
          <component
            :is="
              Array.isArray(deleteInputs) &&
              deleteInputs.length &&
              deleteInputs[0] &&
              deleteInputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="deleteInputs"
            :inputs="deleteInputs"
            :submitFunction="deleteRecord"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="showFilOutput"
        :dialogueTitle="t('buttons.fileOutput')"
        @close="showFilOutput = false"
      >
        <div class="inputs">
          <h3>{{ t("forms.general.heading.fileOutput") }}</h3>
          <AdminFormSinglePageForm
            :inputs="fileOutputInputs"
            :submitFunction="submitGetFileOutput"
          />
        </div>
      </AdminModal>
      <AdminModal
        v-if="recordSelectedForExtraAction && selectedExtraAction"
        :dialogueTitle="selectedExtraAction.title"
        @close="
          selectedExtraAction = null;
          recordSelectedForExtraAction = null;
        "
      >
        <div class="inputs">
          <h3>{{ selectedExtraAction.description }}</h3>
          <component
            :is="
              Array.isArray(selectedExtraAction.inputs) &&
              selectedExtraAction.inputs.length &&
              selectedExtraAction.inputs[0] &&
              selectedExtraAction.inputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="selectedExtraAction.inputs"
            :inputs="selectedExtraAction.inputs"
            :submitFunction="handleExtraAction"
          />
        </div>
      </AdminModal>
      <div class="user-management-page-wrapper active">
        <div class="control-buttons-wrapper">
          <client-only>
            <button
              type="button"
              class="delete-filters-span-button"
              v-if="get.filterInputs && filtersAreApplied()"
              @click="clearFilters"
            >
              <p>{{ t("buttons.clearFilters") }}</p>
              <span class="material-icon round i-xs" disabled>clear</span>
            </button>
          </client-only>
          <button
            type="button"
            class="add-user-control-button filter"
            v-if="get.filterInputs && get.filterInputs.length"
            @click="showFiltersForm = true"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>tune</span>
            </div>
            <p class="add-message">{{ t("buttons.advancedSearch") }}</p>
          </button>
          <slot></slot>
          <button
            v-if="create"
            type="button"
            class="add-user-control-button"
            @click="showCreate()"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>add</span>
            </div>
            <p class="add-message">{{ create?.title }}</p>
          </button>
          <button
            v-if="!hideLogs"
            type="button"
            class="add-user-control-button"
            @click="goToLogPage()"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>history</span>
            </div>
            <p class="add-message">{{ t("buttons.log") }}</p>
          </button>
          <button
            v-if="!disableFileOutput"
            type="button"
            class="add-user-control-button"
            @click="showFilOutput = true"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>download</span>
            </div>
            <p class="add-message">{{ t("buttons.fileOutput") }}</p>
          </button>
          <button
            v-if="selectAction?.button?.title"
            type="button"
            @click="showSelectActionMenu = true"
            class="add-user-control-button"
            :disabled="!selectedRecords.length"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>{{
                selectAction.button.icon
              }}</span>
            </div>
            <p class="add-message">{{ t(selectAction.button.title) }}</p>
          </button>
        </div>
        <client-only v-if="Array.isArray(records) && records.length">
          <p>{{ t("table.headings.recordsFound", { recordsFound }) }}</p>
          <table>
            <thead>
              <th
                :class="[
                  'option-selection-input-option-wrapper',
                  allRecordsAreSelected() ? 'active' : '',
                ]"
                v-if="selectAction?.identifier"
              >
                <label
                  class="option-selection-input-option-label"
                  @click="handleSelectAll"
                >
                  <SvgCheckBox class="option-selection-input-passive-icon" />
                  <SvgActiveCheckBox class="option-selection-input-active-icon" />
                </label>
              </th>
              <th v-if="update || Delete || (extraActions && extraActions.length)">
                {{ t("table.headings.actions") }}
              </th>
              <th v-for="(field, index) in get.visibleFields" :key="index">
                {{ field.value }}
              </th>
            </thead>

            <tbody>
              <tr v-for="record in records" :key="record.id">
                <td
                  v-if="selectAction?.identifier"
                  :class="[
                    'option-selection-input-option-wrapper',
                    selectedRecords.includes(record[selectAction.identifier])
                      ? 'active'
                      : '',
                    selectAction.validateRecord
                      ? selectAction.validateRecord(record)
                        ? 'disabled'
                        : ''
                      : '',
                  ]"
                >
                  <label
                    class="option-selection-input-option-label"
                    :for="`radio-${record.id}`"
                  >
                    <input
                      v-model="selectedRecords"
                      :value="record[selectAction.identifier]"
                      :disabled="
                        selectAction.validateRecord
                          ? selectAction.validateRecord(record)
                          : false
                      "
                      :id="`radio-${record.id}`"
                      :type="'checkbox'"
                      class="option-selection-input"
                    />
                    <SvgCheckBox class="option-selection-input-passive-icon" />
                    <SvgActiveCheckBox class="option-selection-input-active-icon" />
                  </label>
                </td>
                <td
                  v-if="update || Delete || (extraActions && extraActions.length)"
                  class="actions-table-data"
                >
                  <span
                    v-if="update"
                    class="material-icon round yellow"
                    @click.self="askToUpdate(record)"
                    >edit</span
                  >
                  <span
                    v-if="Delete"
                    class="material-icon round red"
                    @click.self="recordSelectedToDelete = record"
                    >delete</span
                  >
                  <span
                    v-for="(action, index) in extraActions"
                    :key="index"
                    class="material-icon round red"
                    @click.self="openExtraActionForm(action, record)"
                    >{{ action.icon }}</span
                  >
                </td>
                <td
                  v-for="(field, index) in get.visibleFields"
                  :key="index"
                  :class="singlePageIncluded ? '' : 'nocurssor'"
                  @click.self="goToSingleRecordPage(record[get.identifier])"
                >
                  <span
                    v-if="field.type === 'boolean'"
                    @click.self="goToSingleRecordPage(record[get.identifier])"
                  >
                    <span
                      v-if="getFieldValue(record, field) == true"
                      class="material-icon round i-xs no-cursor"
                      >check</span
                    >
                    <span v-else class="material-icon round i-xs no-cursor">close</span>
                  </span>
                  <span v-else-if="field.type === 'image'">
                    <span
                      v-if="getFieldValue(record, field)"
                      class="material-icon round i-xs image-previe-button"
                      @click="openImage(getFieldValue(record, field))"
                      target="_blank"
                    >
                      image
                    </span>
                    <span
                      v-if="!getFieldValue(record, field)"
                      class="material-icon round i-xs no-cursor"
                      >close</span
                    >
                  </span>
                  <span v-else @click.self="goToSingleRecordPage(record[get.identifier])">
                    {{ getFieldValue(record, field) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </client-only>
        <div v-if="pagination && Array.isArray(records) && records.length">
          <button
            type="button"
            class="infinite-scroll-button"
            @click="loadMoreData"
            v-if="currentPage < dataPages.length"
          >
            {{ t("buttons.loadMore") }}
            <p>{{ currentPage }} / {{ dataPages.length }}</p>
          </button>
          <button type="button" class="infinite-scroll-button disabled" v-else disabled>
            {{ t("buttons.loadMore") }}
            <p>{{ currentPage }} / {{ dataPages.length }}</p>
          </button>
        </div>
        <AdminPagesErrorLoader v-if="!Array.isArray(records)" code="record-404" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
.admin-body {
  .option-selection-input-option-wrapper {
    padding: 0 !important;
    // width: 100px;
    .option-selection-input-option-label {
      cursor: pointer;
      padding: 5px;
      width: 70px;
      height: 60px;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      .option-selection-input {
        opacity: 0;
        width: 0;
        width: 0;
      }
      .option-selection-input-passive-icon,
      .option-selection-input-active-icon {
        width: 24px;
        height: 24px;
        margin-left: 5px;
      }
      .option-selection-input-active-icon {
        display: none;
      }
      .option-selection-input-title {
        font-size: 1em;
      }
    }
    &.active {
      .option-selection-input-option-label {
        .option-selection-input-active-icon {
          display: block;
          color: $primary;
        }
        .option-selection-input-passive-icon {
          display: none;
        }
      }
    }
    &.active,
    &:hover {
      background-color: $gray-bg;
    }
    &.disabled {
      .option-selection-input-option-label {
        cursor: not-allowed;
        .option-selection-input-passive-icon {
          color: $gray-bg;
        }
      }
      &.active,
      &:hover {
        background-color: white;
      }
    }
  }
  .user-management-page-wrapper.active {
    position: relative !important;
  }
  .delete-message {
    color: red;
  }
  .add-user-control-button {
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid $coral-black-15;
    padding: $sm-padding;
    display: flex;
    color: black;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    margin-bottom: 40px;
    transition: background-color $duration-30;
    @include relative-child-margin($xs-white-space, -bottom);
    &:hover {
      background-color: $light-coral-black-05;
    }

    .add-icon-wrapper {
      display: flex;
      padding: $sm-padding;
      border-radius: 100px;
      border: 1px dashed $coral-black-15;
    }
    &:disabled {
      background-color: white !important;
      border-color: $gray-bg !important;
      cursor: not-allowed;
      color: $gray-bg !important;
      .add-message {
        color: $gray-bg !important;
      }
      .material-icon {
        color: $gray-bg;
      }
    }
  }
  .infinite-scroll-button {
    padding: 10px;
    color: $coral-black;
    margin: 30px auto;
    border: 0.75px solid $coral-black;
    border-radius: 15px;
    cursor: pointer;
  }
  .infinite-scroll-button.disabled {
    border: none;
    color: $coral-black-50;
    cursor: default;
  }
  .control-buttons-wrapper {
    overflow-x: auto;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    button {
      margin-left: 20px;
    }
  }
  .filter {
    position: relative;
  }
  .delete-filters-span-button {
    position: absolute;
    z-index: 6;
    top: -40px;

    font-size: 14px;
    background-color: rgba(255, 43, 43, 0.73);
    padding: 5px;
    color: $coral-black;
    cursor: pointer;
    .material-icon {
      color: $coral-black;
    }
  }
  .nocurssor {
    cursor: default;
  }
  .actions-table-data {
    display: flex;
    justify-content: center;
  }
  .red:hover {
    color: red;
  }
  .yellow:hover {
    color: yellow;
  }
}
.no-cursor {
  cursor: auto !important;
}
</style>
