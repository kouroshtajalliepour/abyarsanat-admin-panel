<script setup lang="ts">
useHead({
  title: "Admin | File Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t } = useI18n();
const localePath = useLocalePath();

const links = ref([
  {
    name: t("links.topLinks.files"),
    path: "/dashboard/file-management",
  },
]);
const imageFormats = ref([
  "image/png", 
  "image/jpeg", 
  "image/gif", 
  "image/jpg"
]);
</script>

<template>
  <div>
    <AdminPagesFileManagementPage :imageFormats="imageFormats" />
  </div>
</template>

<style></style>
