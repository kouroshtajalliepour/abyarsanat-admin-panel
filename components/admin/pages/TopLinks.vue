<script setup lang="ts">
const localePath = useLocalePath();
const { locale, locales } = useI18n();

type ILink = {
  path: string;
  name: string;
};
defineProps<{
  links: ILink[];
}>();

function getDir() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].dir;
}
</script>

<template>
  <div>
    <div :class="['page-navigator-component', getDir() === 'rtl' ? 'rtl' : 'ltr']">
      <span class="link-item" v-for="(link, index) in links" :key="index">
        <NuxtLink class="link" :to="localePath(link.path)">{{ link.name }}</NuxtLink>
      </span>
    </div>
  </div>
</template>
