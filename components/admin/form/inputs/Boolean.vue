<script setup lang="ts">
import { onBeforeMount } from "vue";

let Value: boolean;

onBeforeMount(() => {
  const {
    modelValue: { value },
  } = toRefs(props);
  if (typeof value !== "boolean") {
    emit("update:modelValue", false);
    Value = false;
  } else {
    Value = value;
  }
  console.log("valksjd;flasdf", value);
});

const props = defineProps<{
  label: string;
  modelValue: boolean;
  index: string | number
}>();

const emit = defineEmits(["update:modelValue"]);

function toggle() {
  Value = !Value;
  emit("update:modelValue", Value);
}
</script>

<template>
  <div>
    <div>
      <div class="toggle-button-wrapper">
        <label :for="`toggle-${index}`" class="toggle-label">
          <p>{{ label }}</p>
          <div class="toggle-button">
            <input
              type="checkbox"
              :id="`toggle-${index}`"
              class="toggle-input"
              :value="Value"
              @click="toggle"
              :checked="Value"
            />
            <div class="button-container"></div>
            <div class="button-dot"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/form";

</style>
