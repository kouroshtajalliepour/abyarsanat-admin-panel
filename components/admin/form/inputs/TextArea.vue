<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "remove", "error"]);

const props = defineProps<{
  removeIsAvailable?: boolean;
  modelValue: string;
  label: string;
  error: string;
  validator?: Function;
}>();

const {t} = useI18n();
// * functions
async function handleInput(e: any) {
  emit("error", "");
  emit("update:modelValue", e.target.value);
  try {
    if (props.validator) {
      await props.validator(e.target.value);
    }
  } catch (error: any) {
    emit("error", t(error.message));
  }
}
</script>

<template>
  <div class="textarea-input">
    <p :class="['textarea-title', error ? 'red-label' : '']">
      {{ label }}
      <button v-if="removeIsAvailable" type="button" @click="$emit('remove')">
        <span class="material-icon remove-button">remove</span>
      </button>
    </p>
    <textarea
      name="textarea"
      id="textarea"
      cols="30"
      rows="2"
      :class="['sp-textarea-component', error ? 'error-textarea' : '']"
      type="textarea"
      :value="modelValue"
      @input="handleInput"
    >
    </textarea>
    <p class="error-description" v-if="error">{{ error }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";

</style>
