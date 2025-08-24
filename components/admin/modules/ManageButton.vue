<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/store/admin/index";

// * imports
const { t, locale,locales } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const AdminFormMultiPageForm = resolveComponent("AdminFormMultiPageForm");
const AdminFormSinglePageForm = resolveComponent("AdminFormSinglePageForm");

/*
 * data
 */
const askedToDelete = ref(false);
const askedToEdit = ref(false);
const deleteInputs = ref([
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

// * define props

const emit = defineEmits(["updateRecord","logOut"]);

const props = defineProps<{
  description?: string;
  title?: string;
  to?: string;
  actions?: any;
  record?: any;
  passedLocale?: string;
  getRecordOptions?: any;
  locale?: boolean;
  create?: boolean;
}>();

const adminStore = useAdminStore();

const Record = ref({}) as any;

async function getRecord() {
  try {
    await adminStore.getData({
      token: props.getRecordOptions.token,
      url: props.getRecordOptions.url,
      query: props.getRecordOptions.query,
      lang: props.getRecordOptions.lang,
      dataResult: props.getRecordOptions.dataResult,
    });
    Record.value = { ...adminStore.data };
  } catch (error) {
    Record.value = props.record
    console.log("🚀 ~ file: MultiRecordPageTemplate.vue:539 ~ onMounted ~ error", error);
    // throw error;
  }
}

/*
 * functions
 */

async function askToUpdate() {
  try {
    if (!props.actions.edit) {
      askedToDelete.value = true;
      return;
    }
    if (props.getRecordOptions) {
      await getRecord();
    } else {
      Record.value = props.record;
    }
    for (let i = 0; i < props.actions.edit.inputs.length; i++) {
      const input = props.actions.edit.inputs[i];
      if (Record.value[input.name]) {
        input.value = Record.value[input.name];
      } else {
        input.value = null;
      }
      if (input.fieldToExtractFrom) {
        input.value = Record.value[input.fieldToExtractFrom];
      }
    }
    askedToEdit.value = true;
  } catch (error: any) {
    console.log(error);
  }
}
async function submitEdit(data: any) {
  try {
    const submitFunction = props.actions.edit.submitFunction;
    if (submitFunction) {
      await submitFunction(data);
    } else {
      const MyFunction = props.create ? adminStore.createData : adminStore.updateData;
      await MyFunction({
        data,
        lang: props.passedLocale ? props.passedLocale : locale.value,
        identifier: Record.value[props.actions.edit.identifier],
        dataResult: props.actions.edit.dataResult,
        url: props.actions.edit.apiBaseUrl,
        editLocalized: props.locale,
        createLocalized: props.locale
          ? `/${Record.value[props.actions.edit.identifier]}/locale`
          : "",
        fieldsToUpload: props.actions.edit.fieldsToUpload,
      });
      location.reload();
    }
    askedToEdit.value = false;
  } catch (error:any) {
    if (error.message && (error.message.includes('entities') || error.message.includes('useCases'))) {
      throw new Error (t(error.message))
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}
async function submitDelete(data: any) {
  if (data.confirmation != t("forms.deleteConfirmation")) {
    return;
  }
  try {
    const submitFunction = props.actions.delete.submitFunction;
    if (submitFunction) {
      await submitFunction(data);
    } else {
      await adminStore.deleteData({
        lang: props.passedLocale ? props.passedLocale : locale.value,
        identifier: props.actions.delete.identifier,
        url: props.actions.delete.apiBaseUrl,
        deleteLocalized: props.locale,
      });
    }
    if (props.actions.delete.callBackUrl) {
      router.push(localePath(props.actions.delete.callBackUrl));
    } else {
      askedToDelete.value = false;
    }
  } catch (error:any) {
    if (error.message && (error.message.includes('entities') || error.message.includes('useCases'))) {
      throw new Error (t(error.message))
    } else {
      throw new Error(t("useCases.errors.general.unExpected"));
    }
  }
}
function getFormDirection(){
  const L =  locales.value.filter((l:any) => {
    return l.code === props.passedLocale
  })[0] as any
  if (!L || !L.dir) {
    return null
  }
  return L.dir
}
</script>

<template>
  <div>
    <AdminModal
      v-if="askedToEdit"
      :dialogueTitle="actions.edit.title"
      @close="
        Record = null;
        askedToEdit = false;
      "
      @confirm="emit('logOut')"
    >
      <div class="inputs">
        <component
          :is="
            Array.isArray(actions.edit.inputs) &&
            actions.edit.inputs.length &&
            actions.edit.inputs[0] &&
            actions.edit.inputs[0].inputs
              ? AdminFormMultiPageForm
              : AdminFormSinglePageForm
          "
          :direction="getFormDirection()"
          :inputPages="actions.edit.inputs"
          :inputs="actions.edit.inputs"
          :submitFunction="submitEdit"
        />
      </div>
    </AdminModal>
    <AdminModal
      v-if="askedToDelete"
      :dialogueTitle="actions.delete.title"
      @close="askedToDelete = false"
      @confirm="emit('logOut')"
    >
      <div class="inputs">
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
          :submitFunction="submitDelete"
        />
      </div>
    </AdminModal>

    <div class="category-button-sp-component" :enable-control-buttons="actions">
      <div class="control-buttons-wrapper">
        <div class="control-buttons">
          <button type="button" class="delete-button" v-if="actions && actions.delete">
            <span class="material-icon i-xs round" @click.self="askedToDelete = true"
              >delete</span
            >
          </button>
          <button type="button" class="edit-button" v-if="actions && actions.edit">
            <span
              v-if="!create"
              class="material-icon i-xs round"
              @click.self="askToUpdate"
              >edit</span
            >
            <span v-else class="material-icon i-xs round" @click.self="askToUpdate"
              >add</span
            >
          </button>
        </div>
      </div>
      <NuxtLink v-if="to" :to="to" class="category-link">
        <div class="button-title-content">
          <div class="button-icon-wrapper"><slot /></div>
          <div class="button-title-wrapper">
            <h5 class="button-title">{{ title }}</h5>
          </div>
        </div>
        <div class="button-body-content" v-html="description"></div>
      </NuxtLink>
      <span v-if="!to" @click="askToUpdate" class="category-link">
        <div class="button-title-content">
          <div class="button-icon-wrapper"><slot /></div>
          <div class="button-title-wrapper">
            <h5 class="button-title">{{ title }}</h5>
          </div>
        </div>
        <div class="button-body-content" v-html="description"></div>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/_variables.scss";
.admin-body {
  .category-button-sp-component {
    border-radius: 5px;
    cursor: pointer;
    border: 1px solid $coral-black-15;
    position: relative;
    transition: border-radius $duration-15;
    display: flex;
    isolation: isolate;
    // &::after {
    //   background-color: $black;
    //   border-radius: 5px;
    //   bottom: 0;
    //   content: "";
    //   left: 0;
    //   opacity: 0;
    //   pointer-events: none;
    //   position: absolute;
    //   right: 0;
    //   top: 0;
    //   transition: opacity $duration-30;
    //   z-index: 1;
    // }
    .service-category-image-wrapper {
      position: absolute;
      z-index: 1;
      border-radius: 5px;
      opacity: 0.1;
      transition: opacity $duration-30;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    a.category-link {
      display: block;
      width: 100%;
      border-radius: 5px;
      position: relative;
      background-color: $white;
      z-index: 1;
      padding: $md-padding;
      @include relative-child-margin($std-white-space, -bottom);
    }
    span.category-link {
      display: block;
      width: 100%;
      border-radius: 5px;
      position: relative;
      background-color: $white;
      z-index: 1;
      padding: $md-padding;
      @include relative-child-margin($std-white-space, -bottom);
    }
    &:hover {
      &[enable-control-buttons] {
        border-radius: 0px 0px 5px 5px;
      }
      .service-category-image-wrapper {
        opacity: 0.2;
      }
      // &::after {
      //   opacity: $hover-opacity-dark;
      // }
      .control-buttons-wrapper {
        overflow-x: auto;
        pointer-events: all;
        transform: translateY(0px);
        box-shadow: 0px -3px 3px $black-15;
        display: initial;
        outline: 1px solid $coral-black-15;
      }
    }
    .control-buttons-wrapper {
      overflow-x: auto;
      position: absolute;
      left: 0;
      right: 0;
      margin-bottom: 0;
      transform: translateY(100%);
      bottom: 100%;
      padding: $sm-padding;
      box-shadow: 0 0 0 $black-00;
      outline: 0px solid $coral-black-15;
      transition: transform $duration-15;
      background-color: $coconut-milk;
      border-radius: 5px 5px 0 0;
      z-index: -1;
      transition: transform $duration-15, box-shadow $duration-15, outline $duration-15;
      transform: translateY(100%);
      pointer-events: none;
      span {
        color: $light-coral-black;
      }
    }
    button {
      background-color: transparent;
      &:hover {
        &.delete-button {
          span {
            color: $error-red;
          }
        }
        &.edit-button {
          span {
            color: $primary;
          }
        }
      }
    }
    .control-buttons {
      display: flex;
      @include relative-child-margin($sm-white-space, -right);
    }
    .button-title-content {
      @include relative-child-margin($xs-white-space, -right);
      align-items: center;
      display: flex;
    }
    .button-icon-wrapper {
      height: 48px;
      width: 48px;
      display: flex;
      svg {
        width: 100%;
        height: 100%;
        fill: $light-coral-black;
        path {
          fill: $light-coral-black;
          color: $light-coral-black;
        }
      }
    }
    h5.button-title {
      color: $coral-black;
      font-size: $sm-font-size;
      font-weight: 400;
    }
    p {
      color: $light-coral-black;
      font-size: $xs-font-size;
      line-height: 1.8em;
      font-weight: 300;
    }
  }
}
</style>
