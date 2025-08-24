<template>
  <div :class="[code !== 'record-404' ? 'error-page-wrapper' : '']">
    <h3 class="error-page-title">
      <span v-if="code === '429'">
        {{ t("errorPages.429.title") }}
      </span>
      <span v-else-if="code === '403'">
        {{ t("errorPages.403.title") }}
      </span>
      <span v-else-if="code === '404'">
        {{ t("errorPages.404.title") }}
      </span>
      <span v-else-if="code === 'record-404'">
        {{ t("errorPages.record404.title") }}
      </span>
      <span v-else>
        {{ t("errorPages.500.title") }}
      </span>
    </h3>
    <div v-if="code !== 'record-404'" class="image-wrapper">
      <img src="/images/logo.png" alt="logo" />
    </div>
    <p v-if="code !== 'record-404'" class="error-page-description">
      <button
        class="error-page-description"
        v-if="code !== '429'"
        @click="$router.go(-1)"
      >
        <span class="material-icon round i-xs">undo</span>
        {{ t("errorPages.goPreviousPage") }}
      </button>
      <span class="error-page-description" v-if="code === '429'">
        <span v-if="timer">{{ t("errorPages.429.getTimer", { timer }) }}</span>
        <span v-else>{{ t("errorPages.429.redirecting") }}</span>
      </span>
    </p>
  </div>
</template>
<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{
  code: any;
}>();

const timer = ref(6);

onMounted(() => {
  if (props.code == "429") {
    setInterval(() => {
      if (timer.value === 0) {
        location.reload();
        return clearInterval;
      }
      timer.value -= 1;
    }, 1000);
  }
});
</script>

<style lang="scss">
.image-wrapper {
  height: 400px;
  width: 100%;
  object-fit: contain;
}
.error-page-title {
  font-size: 4em;
  margin-bottom: 35px !important;
  text-align: center;
}
.error-page-description {
  font-size: 1.3em;
  margin-top: 25px !important;
}
</style>
