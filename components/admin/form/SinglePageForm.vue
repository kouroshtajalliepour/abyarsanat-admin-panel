<script setup lang="ts">
// * i18n
const { t } = useI18n();

// * props & emit definitions

const emit = defineEmits([
  "toPreviousPage",
  "goNextPage",
  "filesToUnLink",
  "filesToLink",
]);

let props = defineProps<{
  inputs: any;
  submitFunction?: any;
  page?: string;
  parentClass?: string;
  captchaValidation?: boolean;
  direction?: string
}>();

// * data

const data = ref({}) as any;
const formError = ref("");
const inputLoading = ref(false);
const filesToUnLink = ref([]) as any;
const filesToLink = ref([]) as any;
const captchaToken = ref("") as any;

// * before mount

onMounted(() => {
  for (let i = 0; i < props.inputs.length; i++) {
    const input = props.inputs[i];
    data.value[input.name] = input.value;
  }
});

// * functions
function canGoPreviousPage() {
  if (!props.page) {
    return false;
  }
  const splitPage = props.page.split(" of ");
  const currentPage = splitPage[0] as any;
  const totalPages = splitPage[1] as any;

  return currentPage <= totalPages && currentPage != 1;
}
function mustGoNextPage() {
  if (!props.page) {
    return false;
  }
  const splitPage = props.page.split(" of ");
  const currentPage = splitPage[0];
  const totalPages = splitPage[1];

  return currentPage !== totalPages;
}

function loadError(event: any, index: any) {
  props.inputs[index].error = event;
}
function setOptions(data: any) {
  props.inputs[data.index].options.options = data.values;
}

async function submit() {
  if (inputLoading.value) {
    return;
  }
  formError.value = "";

  let error = false;

  const Data = {} as any;
  try {
    for (let i = 0; i < props.inputs.length; i++) {
      const input = props.inputs[i];
      if (!["image", "file"].includes(input.type)) {
        if (
          input.required &&
          (!data.value[input.name] || !data.value[input.name].length)
        ) {
          props.inputs[i].error = t("forms.general.error.required");
          error = true;
        }
      } else {
        if (input.required) {
          if (!data.value[input.name]) {
            props.inputs[i].error = t("forms.general.error.required");
            error = true;
          }
        }
      }
      if (input.error) {
        error = true;
      }
      if (input.formatter) {
        Data[input.name] = input.formatter(data.value[input.name]);
      } else {
        Data[input.name] = data.value[input.name];
      }
    }
  } catch (err) {
    console.log(err);
  }
  if (props.captchaValidation && !captchaToken.value) {
    formError.value = t("captchaRequired");
    error = true;
  }
  if (error) {
    return;
  }

  data.value.captchaToken = captchaToken.value;
  if (props.page && mustGoNextPage()) {
    emit("filesToLink", filesToLink.value);
    emit("filesToUnLink", filesToUnLink.value);
    emit("goNextPage", data.value);
    return;
  }
  data.value.filesToUnLink = filesToUnLink.value;
  data.value.filesToLink = filesToLink.value;
  if (props.submitFunction) {
    try {
      if (!props.parentClass) {
        document.body.classList.remove("modal-open");
      } else {
        const elements = document.getElementsByClassName(props.parentClass);
        elements[0].classList.remove("modal-open");
      }
      await props.submitFunction(data.value);
    } catch (err: any) {
      formError.value = err.message;
    }
  } else {
    console.log(data.value);
  }
}
function unLinkImage(value: string) {
  const indexOf = filesToLink.value.findIndex((url: string) => {
    return url === value;
  });
  if (indexOf > -1) {
    filesToLink.value.splice(indexOf, 1);
  } else {
    filesToUnLink.value.push(value);
  }
}
function setInputLoading(value: boolean) {
  inputLoading.value = value;
}
function handleBind(value:string, key:string){
  data.value[key] = value
  console.log(data.value)
}
</script>

<template>
  <div class="SinglePageForm-input-wrapper">
    <client-only>
      <form :class="`${direction}-form`" @submit.prevent="submit">
        <div v-for="(input, index) in inputs" :key="index">
          <div v-if="!input.isDepended">
            <AdminFormInputsInput
              v-model="data[input.name]"
              :index="index"
              v-if="['text', 'number', 'password'].includes(input.type)"
              :type="input.type"
              :label="input.label"
              :error="input.error"
              :required="input.required"
              :validator="input.validator"
              :alwaysLtr="input.options?.alwaysLtr"
              :placeholder="input.options?.placeholder"
              :inputmode="input.options?.mode"
              @error="loadError($event, index)"
              @loading="setInputLoading($event)"
            />
            <AdminFormInputsContent
              v-if="input.type === 'html'"
              @imageUnlinked="unLinkImage"
              @imageLinked="filesToLink.push($event)"
              :label="input.label"
              v-model="data[input.name]"
              :error="input.error"
            />
            <AdminFormInputsFileInput
              :type="input.type"
              :label="input.label"
              :placeholder="input.placeholder"
              v-model="data[input.name]"
              :error="input.error"
              :options="input.options"
              @fileUnlinked="filesToUnLink.push($event)"
              @error="loadError($event, index)"
              v-if="['file', 'image'].includes(input.type)"
            />
            <AdminFormInputsComboBox
              @setOptions="setOptions"
              :label="input.label"
              v-model="data[input.name]"
              v-if="input.type === 'select'"
              :name="input.name"
              :options="input.options"
              :error="input.error"
              @error="loadError($event, index)"
            />
            <AdminFormInputsTextArea
              :label="input.label"
              v-model="data[input.name]"
              v-if="input.type === 'textarea'"
              :error="input.error"
              :validator="input.validator"
              @error="loadError($event, index)"
            />
            <AdminFormInputsBoolean
              v-model="data[input.name]"
              :index="index"
              :label="input.label"
              v-if="input.type === 'boolean'"
              text="active"
            />
            <AdminFormInputsDatePicker
              v-model="data[input.name]"
              :label="input.label"
              v-if="input.type === 'date'"
              :options="input.options"
            />
            <AdminFormInputsTTable
              v-if="input.type === 'table'"
              :label="input.label"
              :name="input.name"
              v-model="data[input.name]"
              :error="input.error"
              @error="loadError($event, index)"
              :options="input.options"
              @secondFieldBind="handleBind($event, input?.options?.secondFieldBind?.value)"
            />
            <AdminPagesFileManagementPage
              v-if="input.type === 'filePicker'"
              :label="input.label"
              :imageFormats="input.options.imageFormats"
              v-model="data[input.name]"
              :useAsInput="true"
              :placeholder="input.placeholder"
              :error="input.error"
              :allowedFormats="input.options.allowedFormats"
              @error="loadError($event, index)"
            />
          </div>
        </div>
        <AdminFormInputsReCaptcha v-if="captchaValidation" v-model="captchaToken" />

        <div class="submit-wrapper">
          <p class="error-description" v-if="formError">{{ formError }}</p>
          <slot />
          <div class="inputs singlePage-inputs">
            <button
              class="submit-buttton previous-button"
              type="button"
              v-if="page && canGoPreviousPage()"
              @click="$emit('toPreviousPage')"
            >
              <span class="material-icon round">last_page</span>
            </button>
            <input
              :disabled="inputLoading"
              class="submit-buttton"
              type="submit"
              :value="mustGoNextPage() ? t('buttons.nextPage') : t('buttons.submit')"
            />
          </div>
        </div>
      </form>
    </client-only>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/global";
@import "@/assets/scss/admin/form";

.admin-body{
  .rtl-form{
    input, textarea, .sp-textarea-component{
      direction: rtl;
    }
  }
  .ltr-form{
    input, textarea, .sp-textarea-component{
      direction: ltr;
    }
  }
}
</style>
