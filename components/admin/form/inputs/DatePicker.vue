<script setup lang="ts">
const { t, locale } = useI18n();
const emit = defineEmits(["update:modelValue"]);
const date = ref("");

onBeforeMount(() => {
  date.value = props.modelValue;
});

const props = defineProps<{
  modelValue: string;
  label: string;
  options?: any;
}>();

watch(
  () => date.value,
  () => {
    if (props.options?.singular) {
      if (date.value[1]) {
        emit("update:modelValue", `${date.value[0]},${date.value[1]}`);
      } else {
        emit("update:modelValue", `${date.value[0]},`);
      }
    } else {
      emit("update:modelValue", `${date.value}`);
    }
    //   emit("update:modelValue", date)
  }
);
</script>

<template>
  <div>
    {{ options?.singular }}
    <client-only>
      <date-picker
        :label="label"
        v-model="date"
        :locale="locale"
        format="YYYY-MM-DD HH:mm"
        type="datetime"
        :range="!options?.singular"
      ></date-picker>
    </client-only>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";
</style>
