<script setup lang="ts">
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";
const {t} = useI18n()

const adminStore = useAdminStore();
const { loading, barProgress } = storeToRefs(adminStore);

watch(
  () => barProgress.value,
  () => {
    const barProgressElement: any = document.querySelector(".bar-progress");
    barProgressElement.style.width = `${barProgress.value}%`;
  }
);
</script>

<template>
  <div v-show="loading">
    <div class="loading-wrapper">
      <h3>{{ t("forms.general.loading.title") }}</h3>
      <div class="bar">
        <div class="bar-progress"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
.loading-wrapper {
  opacity: 0;
  animation: fade-in-dialogue $duration-30 forwards;
  position: fixed;
  top: 0;
  z-index: 8;
  background-color: $white-50;
  backdrop-filter: blur(1px);
  inset: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  h3 {
    margin-bottom: 15px;
  }
}
.bar {
  width: 400px;
  height: 25px;
  background-color: rgba(61, 58, 58, 0.05);
  z-index: 1;
  .bar-progress {
    z-index: 2;
    height: 100%;
    width: 0%;
    background-color: $primary;
  }
}
</style>
