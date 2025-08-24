<script setup lang="ts">
// * imports
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";
import { useAdminFileStore } from "@/store/admin/file";
import { useAdminAuthStore } from "@/store/admin/auth";
import { useValidators } from "~/composables/useValidators";
import { useUrl } from "~/composables/useUrl";
const adminStore = useAdminStore();
const adminFileStore = useAdminFileStore();
const { imagePreview } = storeToRefs(adminStore);
const { files, dataPages } = storeToRefs(adminFileStore) as any;
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken

// * props & emits
const props = defineProps<{
  modelValue?: string;
  useAsInput?: boolean;
  imageFormats: string[];
  placeholder?: string;
  error?: string;
  allowedFormats?: any;
  label?:string;
  pageSize?: number;
}>();
const emit = defineEmits(["update:modelValue", "error"]);

// * composables
const {
  validateSlug,
} = useValidators()
const { getUrl } = useUrl();

// * import
const { t } = useI18n();

// * data
const fileHistory = ref([]) as any;
const selection = ref(false);
const actionsWhileSelecting = ref(false);
const selectedFiles = ref([]) as any;
const copiedFiles = ref([]) as any;
const parent = ref({id:null, slug:null}) as any;
const orderBy = ref("created_at desc");
const askedToSearch = ref(false);
const askedToPaste = ref(false);
const askedToUpload = ref(false);
const askedToCreateFolder = ref(false);
const fileToUpdate = ref(null) as any;
const fileToDelete = ref(null) as any;
const loading = ref(true);
const currentPage = ref(1);
const barIsOpen = ref(false);
const gettingNewFiles = ref(true);
const infoIsVisible = ref(false);
const confirmationInput = ref([
  {
    type: "text",
    label: t("forms.deleteConfirmation"),
    name: "confirmation",
    value: "",
    required: true,
    error: "",
    options: {
      
    },
  },
]) as any;
const createNewFolderInput = ref([
  {
    type: "text",
    label: t("entities.fields.slug"),
    name: "slug",
    options: {
      alwaysLtr: true
    },
    validator: validateSlugUniqueness,
    value: "",
    required: true,
    error: "",
  },
]) as any;
const updateInput = ref([
  {
    type: "text",
    label: t("entities.fields.slug"),
    name: "slug",
    options: {
      alwaysLtr: true
    },
    validator: validateSlugUniqueness,
    value: "",
    required: true,
    error: "",
  },
]) as any;
const fileUploadInputs = ref([
  {
    type: "image",
    label: t("entities.fields.image"),
    name: "url",
    value: "",
    required: true,
    error: "",
  },
  {
    type: "text",
    label: t("entities.fields.slug"),
    name: "slug",
    options: {
      alwaysLtr: true
    },
    validator: validateSlugUniqueness,
    required: true,
    error: "",
  },
]) as any;
const filterInputs = ref([
  {
    type: "text",
    label: t("entities.fields.slug"),
    name: "slug",
    validator: validateSlug,
    options: {
      alwaysLtr: true
    },
    value: "",
    error: "",
  },
  {
    type: "select",
    label: t("entities.fields.orderBy"),
    name: "orderBy",
    value: orderBy.value,
    error: "",
    options: {
      nameKey: "key",
      valueKey: "value",
      options: [
        {
          key: t("forms.fileManagement.orderBy.values.createdAtAcs"),
          value: "created_at asc",
        },
        {
          key: t("forms.fileManagement.orderBy.values.createdAtDesc"),
          value: "created_at desc",
        },
        {
          key: t("forms.fileManagement.orderBy.values.slugAsc"),
          value: "slug asc",
        },
        {
          key: t("forms.fileManagement.orderBy.values.slugDesc"),
          value: "slug desc",
        },
      ],
    },
  },
]) as any;

// * hooks

watch(
  () => [parent.value.id, orderBy.value],
  async () => {
    try {
      await getFiles();
    } catch (error: any) {
      console.log("🚀 ~ file: FileManagementPage.vue:175 ~ watch ~ error:", error);
    }
  }
);
onMounted(async () => {
  const events = ["dragenter", "dragover", "dragleave", "drop"];
  function preventDefaults(e: any) {
    e.preventDefault();
  }
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });

  try {
    await getFiles();
  } catch (error: any) {
    console.log("🚀 ~ file: FileManagementPage.vue:175 ~ watch ~ error:", error);
  }
});

// * functions


const { locale } = useI18n();

async function getFiles() {
  try {
    currentPage.value = 1;
    loading.value = true;
    gettingNewFiles.value = true;
    await adminFileStore.getFiles({
      parent: parent.value.id,
      orderBy: orderBy.value,
      pageSize: props.pageSize ? props.pageSize : 20,
      reset: true,
      lang: locale.value,
    });
    gettingNewFiles.value = false;
    loading.value = false;
  } catch (error: any) {
    throw error;
  }
}
async function loadMoreData() {
  try {
    currentPage.value += 1;
    await adminFileStore.getFiles({
      parent: parent.value.id,
      orderBy: orderBy.value,
      pageNumber: currentPage.value,
      pageSize: props.pageSize ? props.pageSize : 20,
      lang: locale.value,
    });
  } catch (error: any) {
    throw error;
  }
}
async function submitPaste(data: any) {
  try {
    const parent_id = parent.value.id ? parent.value.id : "null";

    await adminFileStore.pasteFiles({
      lang: locale.value,
      filesToMove: copiedFiles.value,
      parent_id,
    });
    copiedFiles.value = [];
    await getFiles();
    askedToPaste.value = false;
    actionsWhileSelecting.value = false;
  } catch (error: any) {
    throw error;
  }
}
async function submitDelete(data: any) {
  try {
    await adminFileStore.deleteFile({
      id: fileToDelete.value.id,
      lang: locale.value,
    });
    await getFiles();
    fileToDelete.value = null;
  } catch (error: any) {
    throw error;
  }
}
async function submitUpdate(data: any) {
  try {
    await adminFileStore.updateFile({
      slug: data.slug,
      id: fileToUpdate.value.id,
      lang: locale.value,
    });
    await getFiles();
    fileToUpdate.value = null;
  } catch (error: any) {
    throw error;
  }
}
async function submitCreateNewFolder(data: any) {
  try {
    await adminFileStore.createFolder({
      slug: data.slug,
      lang: locale.value,
      parent_id: parent.value.id,
      format: null,
    });
    await getFiles();
    askedToCreateFolder.value = false;
  } catch (error: any) {
    throw error;
  }
}
async function submitUploadFile(data: any) {
  try {
    await adminFileStore.uploadFile({
      slug: data.slug,
      lang: locale.value,
      parent_id: parent.value.id,
      file: data.url,
      format: data.url.type,
    });
    await getFiles();
    askedToUpload.value = false;
  } catch (error: any) {
    throw error;
  }
}
function submitFilters(data: any) {
  if (data.slug) {
    goToFile({
      id: `search:${data.slug}`,
      slug: `search:${data.slug}`
    });
  }
  if (data.orderBy) {
    orderBy.value = data.orderBy;
  }
  askedToSearch.value = false;
}
function askToUpdate(file: any) {
  updateInput.value[0].value = file.slug;
  fileToUpdate.value = file;
}
function goPrevious() {
  const indexOf = fileHistory.value.findIndex((file: any) => {
    return file.id === parent.value.id;
  });

  switch (indexOf) {
    case -1:
      break;
    case 0:
      parent.value = {id: null, slug:null};
      break;

    default:
      parent.value = fileHistory.value[indexOf - 1];
      break;
  }
}
function canGoNext(): boolean {
  const indexOf = fileHistory.value.findIndex((file: any) => {
    return file.id === parent.value.id;
  });
  return indexOf + 1 < fileHistory.value.length;
}
function goNext() {
  const indexOf = fileHistory.value.findIndex((file: any) => {
    return file.id === parent.value.id;
  });

  if (indexOf + 1 < fileHistory.value.length) {
    parent.value = fileHistory.value[indexOf + 1];
  }
}
function goToFile(file:any) {
  const indexOf = fileHistory.value.findIndex((file: any) => {
    return file.id === parent.value.id;
  });

  if (indexOf + 1 < fileHistory.value.length) {
    fileHistory.value.splice(indexOf + 1);
  }

  fileHistory.value.push(file);
  parent.value = file;
}
function openImage(value: string) {
  imagePreview.value = value;
}
function handleFileClick(file: any) {
  if (selection.value) {
    if (!selectedFiles.value.includes(file.id)) {
      if (selectedFiles.value.length > 15) {
        return;
      }
      selectedFiles.value.push(file.id);
    } else {
      const indexOf = selectedFiles.value.findIndex((fileName: string) => {
        return fileName === file.id;
      });
      selectedFiles.value.splice(indexOf, 1);
    }
    return;
  }
  if (!file.format || file.format == "null") {
    goToFile(file);
  } else if (fileIsImage(file.format)) {
    openImage(file.url);
  } else {
    window.open(file.url, "_blank", "noreferrer");
  }
}
function copyFiles() {
  copiedFiles.value = [...selectedFiles.value];
  selectedFiles.value = [];
  selection.value = false;
}
function handleFileDrop(event: any) {
  const file = event.dataTransfer.files[0];
  if (!file.type) {
    return;
  }
  if (fileIsImage(file.type)) {
    fileUploadInputs.value[0].type = "image";
  }

  fileUploadInputs.value[0].value = file;
  fileUploadInputs.value[1].value = file.name;
  askedToUpload.value = true;
}
function askToUploadFile() {
  fileUploadInputs.value[0].type = "file";
  fileUploadInputs.value[0].value = "";
  fileUploadInputs.value[1].value = "";
  askedToUpload.value = true;
}
function handleSelect(file: any) {
  if (file.format) {
    emit("error", "");
    emit("update:modelValue", file.url);
    toggle();
  }
}
function toggle() {
  barIsOpen.value = !barIsOpen.value;
}
function fileIsImage(format: any): boolean {
  return props.imageFormats.includes(format);
}
function scrollToTop() {
  // scrollTo({ top: 0,
    if(props.useAsInput){
      const yo = document.getElementsByClassName("admin-page-modal")[0];
      yo.scrollTo({ top: 0 });
    }
}
async function validateSlugUniqueness (slug:string){
  
  try {
    await validateSlug(slug)
    const {public:{baseURL}} = useRuntimeConfig()

    const query = {
      owner_table: 'null',
      owner_id: 'null',
      slug,
      parent_id: parent.value.id == null ? 'null' : parent.value.id
    }
    const headers = {
      authorization: `Bearer ${token}`,
    }

    const res:any = await $fetch('/en/admin/manage/file/check', {
      method: 'get',
      headers,
      query,
      baseURL,
    })
    

    if(!res.isAvailableToUse){
      throw new Error("useCases.errors.general.fieldNotUnique")
    }
  } catch (error:any) {
    console.log("🚀 ~ file: FileManagementPage.vue:414 ~ validateSlugUniqueness ~ error:", error)
    throw error
  }
}

const {public: {imageGuide}} = useRuntimeConfig()
</script>

<template>
  <div>
    <AdminModal
      v-if="askedToUpload"
      :dialogueTitle="t('buttons.addFile')"
      @close="askedToUpload = false"
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
    >
      <div class="inputs">
        <AdminFormSinglePageForm
          :inputs="fileUploadInputs"
          :submitFunction="submitUploadFile"
        />
      </div>
    </AdminModal>
    <AdminModal
      v-if="askedToCreateFolder"
      :dialogueTitle="t('buttons.createNewFolder')"
      @close="askedToCreateFolder = false"
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
    >
      <div class="inputs">
        <AdminFormSinglePageForm
          :inputs="createNewFolderInput"
          :submitFunction="submitCreateNewFolder"
        />
      </div>
    </AdminModal>
    <AdminModal
      v-if="askedToSearch"
      :dialogueTitle="t('buttons.advancedSearch')"
      @close="askedToSearch = false"
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
    >
      <div class="inputs">
        <AdminFormSinglePageForm :inputs="filterInputs" :submitFunction="submitFilters" />
      </div>
    </AdminModal>
    <AdminModal
      v-if="askedToPaste"
      :dialogueTitle="t('buttons.pasteFile')"
      @close="askedToPaste = false"
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
    >
      <div class="inputs">
        <h3>
          {{ t("forms.fileManagement.paste.hint", { count: copiedFiles?.length }) }}
        </h3>
        <AdminFormSinglePageForm
          :inputs="confirmationInput"
          :submitFunction="submitPaste"
        />
      </div>
    </AdminModal>
    <AdminModal
      v-if="fileToUpdate"
      :dialogueTitle="t('buttons.updateFile')"
      @close="fileToUpdate = null"
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
    >
      <div class="inputs">
        <AdminFormSinglePageForm :inputs="updateInput" :submitFunction="submitUpdate" />
      </div>
    </AdminModal>
    <AdminModal
      v-if="fileToDelete"
      :dialogueTitle="
        fileToDelete.format == null ? t('buttons.deleteFolder') : t('buttons.deleteFile')
      "
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
      @close="fileToDelete = null"
    >
      <div class="inputs">
        <h3>
          {{
            fileToDelete.format == null
              ? t("forms.fileManagement.deleteFolder.hint")
              : t("forms.fileManagement.deleteFile.hint")
          }}
        </h3>
        <AdminFormSinglePageForm
          :inputs="confirmationInput"
          :submitFunction="submitDelete"
        />
      </div>
    </AdminModal>
    <AdminModal
      :parentClass="useAsInput ? 'admin-page-modal' : ''"
      v-if="infoIsVisible"
      :dialogueTitle="
        t('buttons.imageInfo')
      "
      @close="infoIsVisible = false"
    >
      <div class="inputs">
        <table>
          <thead>
            <th>
              {{ t("entities.fields.field") }}
            </th>
            <th>
              {{ t("entities.fields.width") }}
            </th>
            <th>
              {{ t("entities.fields.height") }}
            </th>
          </thead>
          <tbody>
            <tr v-for="ig in (imageGuide as any)">
              <td
                class="nocurssor"
              >
                <span>{{ t(`pages.logPage.tableName.${ig.table_name}`) }} ({{ t(`entities.fields.${ig.field_name}`) }})</span>
              </td>
              <td
                class="nocurssor"
              >
                <span>{{ ig.width }}</span>
              </td>
              <td
                class="nocurssor"
              >
                <span>{{ ig.height }}</span>
              </td>
              
            </tr>
          </tbody>
        </table>
      </div>
    </AdminModal>
    <div v-if="useAsInput" class="selector-wrapper">
      <label @click.self="toggle">
        {{label}}
      </label>
      <button
        type="button"
        :class="['select-table', error ? 'select-table-error' : '']"
        @click.self="toggle"
      >
        <span v-if="modelValue">
          <a :href="modelValue" target="_blank">{{
            t("forms.general.label.selectedFilePreview")
          }}</a>
        </span>
        <span @click.self="toggle" v-else>{{ placeholder }}</span>
      </button>
    </div>
    <div v-if="!useAsInput || barIsOpen" :class="useAsInput ? 'input-file-management' : 'not-input-file-management' ">
      <div class="files-bar-wrapper">
        <div class="left-side">
          <div class="buttons-wrapper dir_always_ltr">
            <button
              type="button"
              @click="goPrevious"
              :disabled="!parent.slug || selection || loading"
            >
              <span class="material-icon round i-xs primary-icon">arrow_back</span>
            </button>
            <button
              type="button"
              @click="goNext"
              :disabled="!canGoNext() || selection || loading"
            >
              <span class="material-icon round i-xs hover-icon">arrow_forward</span>
            </button>
          </div>
          <div class="parent-wrapper">
            <h3 v-if="parent.slug && parent.slug.split('search:')[1]">
              {{ t("buttons.searchResult", { parent: parent.slug.split('search:')[1] }) }}
            </h3>
            <h3 v-else-if="parent.slug">{{ parent.slug }}</h3>
            <h3 v-else>{{ t("buttons.fileManagement") }}</h3>
          </div>
        </div>
        <div class="right-side">
          <div class="buttons-wrapper">
            <div class="selection-action-button-wrapper">
              <div v-if="actionsWhileSelecting" class="selection-base-actions">
                <button
                  type="button"
                  @click="actionsWhileSelecting = false;
                  selection= false"
                >
                  <span class="material-icon round i-xs hover-icon">
                    <img  class="cancel-button" src="/images/cancel.png" alt="cancel" />
                  </span>
                </button>
                <button
                  type="button"
                  :disabled="!selection || !selectedFiles.length || loading"
                  :class="[copiedFiles.length ? 'selection-is-active' : '']"
                  @click="copyFiles"
                >
                  <span class="info-number" v-if="copiedFiles.length">{{
                    copiedFiles.length
                  }}</span>
                  <span class="material-icon round i-xs hover-icon">file_copy</span>
                </button>
                <button
                  @click="scrollToTop();
                  askedToPaste = true"
                  type="button"
                  :disabled="selection || !copiedFiles.length || loading"
                >
                  <span class="material-icon round i-xs hover-icon">paste</span>
                </button>
              </div>
              <button
                @click="
                  selection = !selection;
                  actionsWhileSelecting = !actionsWhileSelecting;
                  selectedFiles = [];
                  copiedFiles = [];
                "
                :disabled="loading"
                type="button"
                :class="[selection ? 'selection-is-active' : '']"
              >
                <span class="info-number" v-if="selectedFiles.length">{{
                  selectedFiles.length
                }}</span>
                <span class="material-icon round i-xs hover-icon">check_circle</span>
              </button>
            </div>
            <button
              type="button"
              :disabled="selection || loading"
              @click="scrollToTop();askToUploadFile()"
            >
              <span class="material-icon round i-xs hover-icon">attach_file</span>
            </button>
            <button
              type="button"
              :disabled="selection || loading"
              @click="
              scrollToTop();
              askedToCreateFolder = true"
            >
              <span class="material-icon round i-xs hover-icon">create_new_folder</span>
            </button>
            <button type="button" :disabled="selection" @click="scrollToTop();askedToSearch = true">
              <span class="material-icon round i-xs hover-icon" :disabled="loading"
                >search</span
              >
            </button>
            <button type="button" :disabled="selection" @click="scrollToTop();infoIsVisible = true">
              <span class="material-icon round i-xs hover-icon" :disabled="loading"
                >info</span
              >
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!gettingNewFiles"
        :class="['files-wrapper', useAsInput ? 'as-input' : '']"
        @drop.prevent="handleFileDrop"
      >
        <div
          :class="[
            'button-wrapper',
            selection ? 'selection-is-open' : '',
            selectedFiles.includes(file.id) ? 'selected' : '',
          ]"
          v-for="(file, index) in files"
          :key="`file-${index}`"
        >
          <div class="action-buttons-wrapper">
            <button type="button" @click="scrollToTop();askToUpdate(file)">
              <span class="material-icon round i-xs hover-icon file-action-button">edit</span>
            </button>
            <button type="button" @click="scrollToTop();fileToDelete = file">
              <span class="material-icon round i-xs hover-icon file-action-button">delete</span>
            </button>
            <button
              v-if="
                useAsInput &&
                file.format &&
                (allowedFormats === '*' || allowedFormats?.includes(file.format))
              "
              type="button"
              @click="handleSelect(file)"
            >
              <span class="material-icon round i-xs hover-icon check-circle">check_circle</span>
            </button>
          </div>
          <button
            type="button"
            :class="['add-user-control-button filter']"
            @click="handleFileClick(file)"
          >
            <div
              v-if="!file.format || !fileIsImage(file.format)"
              class="add-icon-wrapper border-none"
            >
              <span v-if="!file.format || file.format == 'null'">
                <span :class="['material-icon round i-md', 'primary-icon']">folder</span>
                <span :class="['material-icon round i-md', 'hover-icon']"
                  >folder_open</span
                >
              </span>
              <span v-else>
                <div >
                  <span 
                    v-if="file.format == 'application/pdf'" 
                    class="material-icon round i-md primary-icon different-files-icon"
                  >
                    <img src="/images/pdf-icon.png" alt="pdf" />
                  </span>
                  <span 
                    v-else-if="file.format == 'video/mp4'" 
                    class="material-icon round i-md primary-icon different-files-icon"
                  >
                    <img src="/images/mp4-icon.png" alt="mp4" />
                  </span>
                  <span 
                    v-else-if="file.format == 'audio/mpeg'" 
                    class="material-icon round i-md primary-icon different-files-icon"
                  >
                    <img src="/images/mp3-icon.png" alt="mp3" />
                  </span>
                  <span 
                    v-else 
                    class="material-icon round i-md primary-icon different-files-icon"
                  >
                    <img src="/images/file-icon.png" alt="file" />
                  </span>
                  <span class="material-icon round i-md hover-icon">open_in_new</span>
                </div>
              </span>
            </div>
            <div v-else class="image-wrapper">
              <img v-if="file.url" :src="getUrl(file.url)" />
              <div class="hover-element-wrapper">
                <span class="material-icon round i-md">open_in_full</span>
              </div>
            </div>
            <div class="add-message-wrapper">
              <p class="add-message">{{ file.slug }}</p>
            </div>
          </button>
        </div>
      </div>
      <div class="file-loader-wrapper" v-if="loading">
        <span class="material-icon round i-md">sync</span>
      </div>
      <div v-if="!loading">
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
    </div>
    <p class="error-description" v-if="error">{{ error }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
.border-none {
  border: none !important;
}

.admin-body {
  .file-loader-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 3em !important;
      animation-name: example;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      @keyframes example {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
  .not-input-file-management {
    display: block;
    .files-bar-wrapper {
      margin-right: 20px;
    }
  }
  .files-bar-wrapper {
    margin: 10px auto 40px auto;
    position: sticky;
    top: 0;
    background-color: #f5f5f5;
    padding: 20px 20px;
    border-radius: 5px;
    max-width: 900px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;
    top: 0;
    z-index: 2;
    .left-side {
      display: flex;
      align-items: center;
      margin: 10px 0;
      justify-self: center;
    }
    .dir_always_ltr {
      direction: ltr !important;
    }
    .buttons-wrapper {
      display: flex;
      margin: 0 10px;
      align-items: center;
    }
    button {
      border-radius: 20%;
      margin: 0px 5px;
      padding: 3px;
      position: relative;
      max-height: 30px;
      &:hover {
        span {
          color: $primary;
        }
      }
      &:disabled {
        background-color: #f5f5f5 !important;
        span {
          color: unset;
        }
      }
      &.selection-is-active {
        background-color: $primary !important;
        span {
          color: unset;
        }
      }
      .info-number {
        position: absolute;
        top: -12px;
        font-size: 1.1em;
        color: $primary !important;
      }
    }
  }
  .files-wrapper {
    max-width: 890px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    z-index: 1;
    .button-wrapper {
      height: 130px;
      flex-basis: calc(20% - 20px);
      min-width: calc(20% - 20px);
      margin: 0 10px;
      margin-bottom: 40px;
      position: relative;
      border: 1px solid $coral-black-15;
      border-radius: 5px;
      &.selection-is-open {
        &:hover {
          border-color: $primary;
        }
        &.selected {
          border: 2.7px solid $primary;
        }
        &.de-active {
          background-color: $light-coral-black-15 !important;
          border-color: $coral-black-15 !important;
          cursor: unset;
          &:hover {
            background-color: $light-coral-black-15 !important;
          }
        }

        .primary-icon {
          display: block !important;
        }
        .hover-icon {
          display: none !important;
        }
        .image-wrapper {
          padding: 0 14px !important;
          .hover-element-wrapper {
            display: none !important;
          }
        }
      }
      .add-user-control-button {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: pointer;
        padding: $sm-padding;
        display: flex;
        color: black;
        border: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        padding-top: unset !important;
        transition: background-color $duration-30;
        overflow: hidden;
        @include relative-child-margin($xs-white-space, -bottom);
        .hover-icon {
          display: none;
        }
        &:hover {
          overflow: visible;
          background-color: $light-coral-black-05;
          .primary-icon {
            display: none;
          }
          .hover-icon {
            display: block;
          }
        }
        .add-icon-wrapper {
          position: relative;
          display: flex;
          padding: $sm-padding;
        }
        .image-wrapper {
          object-fit: contain;
          width: 100%;
          height: 54px;
          max-height: 54px;
          min-height: 54px;
          position: relative;
          .hover-element-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            justify-content: center;
            align-items: center;
          }
          img {
            height: 100%;
            width: 100%;
          }
        }
        .add-message-wrapper {
          width: 100%;
          position: absolute;
          bottom: 15px;
        }
      }

      .action-buttons-wrapper {
        position: absolute;
        width: 20%;
        top: 0;
        display: flex;
        flex-direction: column;
        height: 25px;
        z-index: -1;
        button {
          transition: background-color $duration-30;
          padding: 3px 0;
        }
      }
      &:hover {
        .image-wrapper {
          .hover-element-wrapper {
            display: flex;
          }
        }
        .action-buttons-wrapper {
          z-index: 1;
        }
      }
      .selection-is-open {
        .action-buttons-wrapper {
          display: none;
        }
      }
    }
  }
  .select-table {
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    height: auto;
    font-size: 1.125rem;
    color: #3d3a3a;
    width: 100%;
    border: 1px solid rgba(17, 12, 11, 0.15);
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    margin: 20px 0;
    min-height: 40px;
  }
  .select-table-error {
    border: 1px solid red;
  }
}
.selection-action-button-wrapper {
  position: relative;
  padding: 3px;
}
.selection-base-actions {
  position: absolute;
  padding: 4px 0 !important;
  z-index: 2;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 5px !important;
  background-color: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  .cancel-button {
    width: 24px;
  }
}
.different-files-icon {
  height: 48px;
  width: 48px;
}
.selector-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  label {
    font-size: 20px;
    color: $primary;
  }
  button {
    width: 50% !important;
  }
}
.check-circle {
  margin-top: 44px !important;
}
</style>
