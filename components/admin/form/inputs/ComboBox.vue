<script setup lang="ts">
// * defining
const selected = ref("");
const value = ref("");

// ! set options must return an object that includes index and values
type IOptions = {
  options: any;
  setOptions?: any;
  nameKey: string;
  valueKey: string;
  type?: string;
  search?: string;
};

// * defining props & emits
const emit = defineEmits(["error", "setOptions", "update:modelValue"]);
const props = defineProps<{
  options: IOptions;
  name: string;
  label: string;
  error?: string;
  modelValue?: string | null;
}>();

// * functions
async function handleSelect(e: any) {
  try {
    emit("update:modelValue", e.target.value);
    emit("error", "");
    if (props.options.setOptions) {
      emit("setOptions", await props.options.setOptions(e.target.value));
    }
  } catch (err: any) {
    emit("error", err.message);
  }
}
</script>

<template>
  <div class="options-label" v-if="options.options && options.options.length">
    <label :class="['combobox-label', error ? 'red-label' : '']" :for="name">{{
      label
    }}</label>
    <div class="select-input-container">
      <label :for="name" class="sp-combobox-component" tabindex="0">
        <select
          :name="name"
          :id="name"
          :class="['sp-combobox-input', error ? 'sp-combobox-input-error' : '']"
          :value="modelValue"
          @change="handleSelect"
        >
          <option
            :id="option"
            :value="option[options.valueKey]"
            :class="[`sp-combobox-option-${option}`]"
            ref="option"
            v-for="(option, index) in options.options"
            :key="index"
          >
            {{ option[options.nameKey] }}
          </option>
        </select>
      </label>
    </div>
    <p class="error-description" v-if="error">{{ error }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";
</style>
