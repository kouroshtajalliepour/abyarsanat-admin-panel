<script setup lang="ts">
// * imports
import moment from "jalali-moment";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
const { t, locale,locales } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

// * types
type ITable = {
  name: string;
  value: string;
};
type IFilterInput = {
  value: string;
  label: string;
};

// * defining data
const AdminFormMultiPageForm = resolveComponent("AdminFormMultiPageForm");
const AdminFormSinglePageForm = resolveComponent("AdminFormSinglePageForm");
const adminStore = useAdminStore();
const {
  loadedAt,
  recordsFound,
  dataPages,
  multiData: records,
  imagePreview,
} = storeToRefs(adminStore) as any;

// * props & emit defenitions
const emit = defineEmits(["toPreviosPage", "goNextPage", "goToAuthorPage"]);
const props = defineProps<{
  tables: ITable[];
  authorFilterInput: IFilterInput;
  hiddenFields: string[];
  imageFields: string[];
  largeFields: string[];
  visibleIds: any;
  linkFields: any;
}>();

// * validators
const {
  validateULID,
} = useValidators()

// * variables
const get = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  visibleFields: [
    {
      value: t("entities.fields.operation"),
      key: "operation",
    },
    {
      value: t("entities.fields.fieldType"),
      key: "locale",
    },
    {
      value: t("entities.fields.tableName"),
      key: "table_name",
    },
    {
      value: t("entities.fields.authorTableName"),
      key: "author",
    },
    {
      value: t("entities.fields.at"),
      key: "created_at",
      _constructor: (value: any) => {
        try {
          return moment(value).locale(locale.value).calendar();
        } catch (error) {
          console.log("🚀 ~ file: index.vue:285 ~ error", error);
        }
      },
    },
  ],
  filterInputs: [
    {
      type: "text",
      label: t("entities.fields.row_id"),
      name: "row_id",
      options: {
        alwaysLtr: true
      },
      value: "",
      validator: validateULID,
      required: false,
      error: "",
    },
    props.authorFilterInput,
    {
      type: "select",
      label: t("entities.fields.operation"),
      name: "operation",
      value: "",
      required: false,
      error: "",
      options: {
        nameKey: "name",
        valueKey: "value",
        options: [
          {
            name: t(`pages.logPage.operations.INSERT`),
            value: "INSERT",
          },
          {
            name: t(`pages.logPage.operations.UPDATE`),
            value: "UPDATE",
          },
          {
            name: t(`pages.logPage.operations.DELETE`),
            value: "DELETE",
          },
        ],
      },
    },
    {
      type: "select",
      label: t("entities.fields.table_name"),
      name: "table_name",
      value: "",
      required: false,
      error: "",
      options: {
        nameKey: "name",
        valueKey: "value",
        options: [...props.tables],
      },
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
      type: "date",
      label: t("entities.fields.at"),
      name: "created_at",
      value: "",
      required: false,
    },
  ],
}) as any;
const apiBaseUrl = ref("/admin/manage/log");
const baseUrl = ref(`/dashboard/log`);
const singlePageIncluded = ref(true);
const pagination = ref(true);
const pageSize = ref(10);
const selectedOperation = ref(null) as any;
const showFiltersForm = ref(false);
const runTimeError = ref(null) as any;
const currentPage = ref(1);
const showChanges = ref(false);
const selectedOld = ref({});
const selectedNew = ref({});
const selectedRowId = ref('');
const selectedTable = ref('');


// * hooks

await onMounted(async () => {
  try {
    let pageNumber;
    if (pagination.value) {
      pageNumber = currentPage.value;
    }

    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: pageSize.value,
      dataResult: get.value.dataResult,
      dataCountResult: get.value.dataCountResult,
      preDefined: get.value.preDefined,
      url: apiBaseUrl.value,
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

// * functions
function goToSingleRecordPage(record: any) {
  selectedOperation.value = record.operation;
  selectedOld.value = record.old_value;
  selectedNew.value = record.new_value;
  selectedTable.value = record.table_name
  selectedRowId.value = record.row_id
  showChanges.value = true;
  //   if (singlePageIncluded.value && get.value.singleRecordUrl) {
  //     navigateTo(localePath(`${get.value.singleRecordUrl}${id}`));
  //   }
}
function getFieldValue(recordSelectedToDelete: any, field: any) {
  if (field._constructor) {
    return field._constructor(recordSelectedToDelete[field.key]);
  }
  return recordSelectedToDelete[field.key];
}
function filtersAreApplied() {
  for (let i = 0; i < get.value.filterInputs.length; i++) {
    const filterInput = get.value.filterInputs[i];
    if (route.query[filterInput.name]) {
      get.value.filterInputs[i].value = route.query[filterInput.name];
      return true;
    }
  }
  return false;
}
async function submitFilters(filters: any) {
  try {
    let query = {} as any;
    for (let i = 0; i < get.value.filterInputs.length; i++) {
      const filterInput = get.value.filterInputs[i];
      if (filters[filterInput.name]) {
        query[filterInput.name] = filters[filterInput.name];
      }
    }
    showFiltersForm.value = false;
    currentPage.value = 1;
    await adminStore.getMultiData({
      lang: locale.value,
      dataResult: get.value.dataResult,
      dataCountResult: get.value.dataCountResult,
      preDefined: get.value.preDefined,
      url: apiBaseUrl.value,
      pageSize: pageSize.value,
      pageNumber: currentPage.value,
      query,
    });
    await navigateTo({
      path: localePath(baseUrl.value),
      query,
    });
  } catch (error: any) {
    throw new Error(t("useCases.errors.general.unExpected"));
  }
}
async function loadMoreData() {
  try {
    currentPage.value++;

    const query = { ...route.query };

    if (!query.created_at) {
      query.created_at = `1990,${moment(loadedAt.value).format("YYYY-MM-DD HH:MM")}`;
    } else if (typeof query.created_at === "string" && query.created_at.split(",").length < 2) {
      query.created_at = `${query.created_at},${moment(loadedAt.value).format("YYYY-MM-DD HH:MM")}`;
    }
    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: pageSize.value,
      dataResult: get.value.dataResult,
      keepOldData: true,
      dataCountResult: get.value.dataCountResult,
      preDefined: get.value.preDefined,
      url: apiBaseUrl.value,
      pageNumber: currentPage.value,
      query,
    });
  } catch (err: any) {
    console.log('this is an error')
    console.log(err);
  }
}
async function clearFilters() {
  try {
    for (let i = 0; i < get.value.filterInputs.length; i++) {
      get.value.filterInputs[i].value = "";
    }
    currentPage.value = 1;

    await adminStore.getMultiData({
      lang: locale.value,
      pageSize: pageSize.value,
      dataResult: get.value.dataResult,
      dataCountResult: get.value.dataCountResult,
      preDefined: get.value.preDefined,
      url: apiBaseUrl.value,
      pageNumber: currentPage.value,
      query: {},
    });
    navigateTo(localePath(baseUrl.value));
  } catch (error) {
    throw error;
  }
}
function getLocaleDisplayName(localeCode:string){
  if (!localeCode) {
    return t("pages.logPage.general")
  }
  const Locale = locales.value.filter((l:any) => {
    return l.code === localeCode
  })[0] as any
  return Locale.displayName
  
}
function getGroupName(row_id:string, table_name:string){

  const {
    validateULID
  } = useValidators()
  const tableNameIsLocalized = table_name.split('_localized_info')
  const tableName = tableNameIsLocalized ? tableNameIsLocalized[0] : table_name

  if (!row_id) {
    return tableName
  }

  try {
    validateULID(row_id)

    return tableName
  } catch (error) {
    if(tableName != 'info'){
      return `${row_id}_${tableName}` 
    }else {
      return tableName
    }
  }
}
function getBackGroundColor(operation:string) {
  switch (operation) {
    case 'UPDATE':
        return"#ADD8E6"
      break;
    case 'INSERT':
        return"#90EE90"
      break;
    case 'DELETE':
        return"#FF7F7F"
      break;
  
    default:
      return 'inherit'
      break;
  }
}
function openImage(value: string) {
  imagePreview.value = value;
}
</script>

<template>
  <div>
    <AdminModalChangesModal
      @close="showChanges = false"
      :old="selectedOld"
      :tableName="getGroupName(selectedRowId, selectedTable)"
      :new="selectedNew"
      :operation="selectedOperation"
      :hiddenFields="hiddenFields"
      :largeFields="largeFields"
      :imageFields="imageFields"
      :linkFields="linkFields"
      :visibleIds="visibleIds"
      v-if="showChanges"
    />
    <div v-if="runTimeError">
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
            v-if="get.filterInputs"
            @click="showFiltersForm = true"
          >
            <div class="add-icon-wrapper">
              <span class="material-icon round i-xs" disabled>tune</span>
            </div>
            <p class="add-message">{{ t("buttons.advancedSearch") }}</p>
          </button>
        </div>

        <client-only v-if="Array.isArray(records) && records.length">
          <p>{{ t("table.headings.recordsFound", { recordsFound }) }}</p>
          <table>
            <thead>
              <th v-for="(field, index) in get.visibleFields" :key="index">
                {{ field.value }}
              </th>
            </thead>
            <tbody>
              <tr v-for="record in records" :key="record.id" :style="`background-color: ${getBackGroundColor(record.operation)};`">
                <td
                  v-for="(field, index) in get.visibleFields"
                  :key="index"
                  :class="singlePageIncluded ? '' : 'nocurssor'"
                  @click.self="goToSingleRecordPage(record)"
                >
                  <span
                    v-if="field.key === 'locale'"
                    @click="goToSingleRecordPage(record)"
                  >
                    {{getLocaleDisplayName(record.locale)}}
                  </span>
                  <span
                    v-else-if="field.key === 'operation'"
                    @click="goToSingleRecordPage(record)"
                  >
                  {{t(`pages.logPage.operations.${record.operation}`)}}
                  </span>
                  <span
                    v-else-if="field.key === 'table_name'"
                    @click="goToSingleRecordPage(record)"
                  >
                  {{t(`pages.logPage.tableName.${getGroupName(record.row_id, record.table_name)}`)}}
                  </span>
                  <span
                    v-else-if="field.key === 'author'"
                    @click="emit('goToAuthorPage', record)"
                    class="hover-primary"
                  >
                    {{ t(`pages.logPage.authorRoles.${record.author_role}`) }}
                  </span>
                  <span
                    v-else-if="field.type === 'boolean'"
                    @click="goToSingleRecordPage(record)"
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
                  <span v-else @click="goToSingleRecordPage(record)">
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
  .user-management-page-wrapper.active {
    position: relative !important;
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
  .hover-primary:hover {
    color: $primary;
  }
}
.no-cursor {
  cursor: auto !important;
}
</style>
