<script setup lang="ts">
// * props & emit definitions

let Data = {} as any;

const formError = ref("");

const currentPage = ref(1);
const filesToUnLink = ref([]) as any;
const filesToLink = ref([]) as any;

const props = defineProps<{
  inputPages: any;
  submitFunction?: any;
  direction?: string
}>();

// * functions

function toPreviousPage(index: number) {
  currentPage.value = index;
}

function goNextPage(receivedData: any) {
  Data = {
    ...Data,
    ...receivedData,
  };
  currentPage.value++;
}
async function SubmitFunction(receivedData: any) {
  Data = {
    ...Data,
    ...receivedData,
    filesToUnLink: filesToUnLink.value,
    filesToLink: filesToLink.value,
  };
  if (receivedData.filesToLink) {
    Data.filesToLink = [...Data.filesToLink, ...receivedData.filesToLink];
  }
  if (receivedData.filesToUnLink) {
    Data.filesToUnLink = [...Data.filesToUnLink, ...receivedData.filesToUnLink];
  }

  if (props.submitFunction) {
    try {
      formError.value = "";
      await props.submitFunction(Data);
    } catch (err: any) {
      formError.value = err.message;
    }
  } else {
    console.log(Data);
  }
}
</script>

<template>
  <div class="MultiPageForm-input-wrapper">
    <h3 class="content-selector-title">
      {{ currentPage }} / {{ inputPages.length }} {{ inputPages[currentPage - 1].title }}
    </h3>
    <div v-for="(inputPage, index) in inputPages" :key="`page-no-${index}`">
      <AdminFormSinglePageForm
        v-show="index + 1 === currentPage"
        :inputs="inputPage.inputs"
        :page="`${index + 1} of ${inputPages.length}`"
        @toPreviousPage="toPreviousPage(index)"
        @goNextPage="goNextPage"
        :submitFunction="SubmitFunction"
        :direction="direction"
        @filesToUnLink="filesToUnLink.push(...$event)"
        @filesToLink="filesToLink.push(...$event)"
      >
        <p class="error-description" v-if="formError">{{ formError }}</p>
      </AdminFormSinglePageForm>
    </div>
  </div>
</template>

<style></style>
