<template>
  <div>redirecting ...</div>
</template>

<script lang="ts" setup>
const localePath = useLocalePath()
onMounted(async () => {
  navigateTo(localePath("/dashboard"));
});
</script>
