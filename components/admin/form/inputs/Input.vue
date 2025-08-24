<script setup lang="ts">
import { ref } from "vue";
// * define data
const passwordToggle: boolean = false;

const Label = ref(null) as any;
const Input = ref(null) as any;
const passwordIsVisible = ref(false);

// * define emits and props

const emit = defineEmits(["update:modelValue", "error", "loading"]);

const props = defineProps<{
  modelValue?: string | null;
  label: string;
  placeholder?: string;
  type: string;
  error?: string;
  required: boolean
  validator?: any;
  alwaysLtr?: boolean;
  inputmode?: "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  index?: Number;
}>();

// * functions

let validationTimeOut: any;

const {t} = useI18n();

function handleInput(e: any) {
  if (!props.required && !e.target.value) {
    clearTimeout(validationTimeOut);
    emit("loading", false)
    emit("error", "");
    emit("update:modelValue", e.target.value);
    return;
  }
  emit("loading", true);
  clearTimeout(validationTimeOut);
  validationTimeOut = setTimeout(validation, 1000);
  emit("error", "");
  emit("update:modelValue", e.target.value);
  async function validation() {
    try {
      if (props.validator) {
        await props.validator(e.target.value);
      }
      emit("loading", false);
    } catch (error: any) {
      emit("error", t(error.message));
    }
  }
}

function numberInput(e: any) {
  e = e || window.event;
  var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
  var charStr = String.fromCharCode(charCode);
  if (charStr !== '-') {
    if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
  }else {
    if (props.modelValue?.length) {
      e.preventDefault();
    }
  }
}

function changeLabelPlace() {
  Label._value.style.top = "-20px";
  Label._value.style.fontSize = "1em";
}

function defaultLabelPlace() {
  if (Input.value.value != "") {
    Label._value.style.top = "-20px";
    Label._value.style.fontSize = "1em";
  } else {
    Label._value.style.top = "0";
    Label._value.style.fontSize = "1.5em";
  }
}

function passwordVisibility() {
  const passwordInput: any = document.querySelector(`#password${props.index}`);
  const type = passwordInput.getAttribute("type");
  const visibility: any = document.querySelector(".visibility");
  const visibilityOff: any = document.querySelector(".visibility-off");
  if (type == "password") {
    passwordInput.type = "text";
    passwordIsVisible.value = true;
  } else {
    passwordInput.type = "password";
    passwordIsVisible.value = false;
  }
}
</script>

<template>
  <div class="inputs-wrapper">

    <!-- input type text -->
    <div :class="['sp-input', error ? 'error-input' : '']" v-if="type === 'text'">
      <label
        :class="[
          'input-label',
          modelValue ? 'god-forgive-me' : '',
          error ? 'error-description' : '',
        ]"
        ref="Label"
        :for="`text${index}`"
        >{{ label }}</label
      >
      <input
        @focus="changeLabelPlace"
        @focusout="defaultLabelPlace"
        :inputmode="inputmode? inputmode : 'text'"
        :name="`text${index}`"
        :id="`text${index}`"
        ref="Input"
        v-if="type === 'text'"
        type="text"
        :class="['sp-input-component', alwaysLtr ? 'dir-always-ltr' : '']"
        :placeholder="placeholder"
        @input="handleInput"
        :value="modelValue"
      />
      <p class="error-description" v-if="error">{{ error }}</p>
    </div>
    <!-- input type number -->
    <div :class="['sp-input', error ? 'error-input' : '']" v-if="type === 'number'">
      <label
        :class="[
          'input-label',
          modelValue ? 'god-forgive-me' : '',
          error ? 'error-description' : '',
        ]"
        ref="Label"
        :for="`number${index}`"
        >{{ label }}</label
      >
      <input
        @focus="changeLabelPlace"
        @focusout="defaultLabelPlace"
        :inputmode="inputmode? inputmode : 'text'"
        :name="`number${index}`"
        :id="`number${index}`"
        ref="Input"
        v-if="type === 'number'"
        @keypress="numberInput"
        type="number"
        :class="['sp-input-component', 'dir-always-ltr']"
        :placeholder="placeholder"
        @input="handleInput"
        :value="modelValue"
      />
      <p class="error-description" v-if="error">{{ error }}</p>
    </div>
    <!-- input type password -->
    <div :class="['sp-input', error ? 'error-input' : '']" v-if="type === 'password'">
      <label
        :class="[
          'input-label',
          modelValue ? 'god-forgive-me' : '',
          error ? 'error-description' : '',
        ]"
        ref="Label"
        :for="`password${index}`"
        >{{ label }}</label
      >
      <input
        @focus="changeLabelPlace"
        @focusout="defaultLabelPlace"
        :inputmode="inputmode? inputmode : 'text'"
        :name="`password${index}`"
        :id="`password${index}`"
        ref="Input"
        v-if="type === 'password'"
        type="password"
        :class="['sp-input-component', 'dir-always-ltr']"
        :placeholder="placeholder"
        @input="handleInput"
        :value="modelValue"
      />

      <div
        :class="['password-toggle', error ? 'error-description' : '']"
        @click="passwordVisibility"
      >
        <span v-if="!passwordIsVisible" class="material-icon visibility">visibility</span>
        <span v-if="passwordIsVisible" class="material-icon visibility-off"
          >visibility_off</span
        >
      </div>
      <p class="error-description" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";
.dir-always-ltr{
  direction: ltr !important;
}

</style>
