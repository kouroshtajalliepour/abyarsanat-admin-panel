<script setup lang="ts">
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";
import { useUrl } from "~/composables/useUrl";
const { getUrl } = useUrl();

const adminStore = useAdminStore();
const { imagePreview, contentPreview } = storeToRefs(adminStore);

function closeModal(){
  imagePreview.value = null; 
  contentPreview.value  = null
}
</script>

<template>
  <div v-show="imagePreview || contentPreview" @click="closeModal">
    <div class="image-preview-wrapper">
      <img v-if="imagePreview && typeof imagePreview === 'string'" :src="getUrl(imagePreview)" class="image-item" />
      <div v-else>
        <span v-if="Array.isArray(contentPreview)">
          <span
            v-for="(test, index) in contentPreview"
            :key="`preview-content-wrapper-${index}`"
            v-html="test.context"
          >
          </span>
        </span>
        <span v-else>{{ contentPreview }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
.image-preview-wrapper {
  opacity: 0;
  animation: fade-in-dialogue $duration-30 forwards;
  position: fixed;
  top: 0;
  z-index: 9;
  background-color: $white-50;
  backdrop-filter: blur(1px);
  inset: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  object-fit: contain;
  .image-item {
    width: 100%;
    height: auto;
    max-height: 100%;
  }
}
</style>
