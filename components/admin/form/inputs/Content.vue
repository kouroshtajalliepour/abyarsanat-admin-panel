<script setup lang="ts">
const emit = defineEmits(["update:modelValue", "imageUnlinked", "imageLinked"]);
const {t} =useI18n()
type content = {
  type: string;
  context: string;
}[];

let props = defineProps<{
  modelValue: content;
  label: string;
  error?: string;
}>();

const AdminFormInputsTextArea = resolveComponent("AdminFormInputsTextArea");
const AdminFormInputsHtmlEditor = resolveComponent("AdminFormInputsHtmlEditor");

onMounted(() => {
  if (!Array.isArray(props.modelValue)) {
    emit("update:modelValue", []);
  }
});

// * functions

function addContent(type: string) {
  props.modelValue.push({
    type,
    context: "",
  });
}
function removeContent(index: number) {
  props.modelValue.splice(index, 1);
}
</script>

<template>
  <div>
    <div class="content-add-buttons">
      <label class="content-label">{{ label }}</label>
      <div class="content-buttons-wrapper">
        <button @click="addContent('html-text')" type="button">
          <span class="material-icon i-xs round">add</span>
          {{ t("entities.values.editor.editor") }}
        </button>
        <button @click="addContent('html')" type="button">
          <span class="material-icon i-xs round">add</span>
          {{ t("entities.values.editor.text") }}
        </button>
      </div>
    </div>
    <component
      @remove="removeContent(index)"
      @imageUnlinked="emit('imageUnlinked', $event)"
      @imageLinked="emit('imageLinked', $event)"
      :removeIsAvailable="true"
      :is="c.type === 'html' ? AdminFormInputsTextArea : AdminFormInputsHtmlEditor"
      :label="`${index + 1}`"
      v-model="c.context"
      :error="error"
      v-for="(c, index) in modelValue"
      :key="index"
    />
    {{ error }}
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/form";

</style>
