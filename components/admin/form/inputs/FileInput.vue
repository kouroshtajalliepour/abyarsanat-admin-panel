<script setup lang="ts">
// * props & emit defenitions
import { useUrl } from "~/composables/useUrl";
const { getUrl } = useUrl();
const emit = defineEmits(["update:modelValue", "fileUnlinked", "error"]);

const props = defineProps<{
  type: string;
  label: string;
  modelValue: string;
  error: string;
  placeholder?: string;
  options: any;
}>();

// * data definitions
const initialFile = ref(null) as any;
const fileSelected = ref(false) as any;
const maxSize = ref(280000000);


// * before component mount

onMounted(async () => {
  if (props.modelValue) {
    initialFile.value = props.modelValue;
  }

  if (props.options?.maxSize) {
    maxSize.value = props.options.maxSize * 1000;
  }

  if (typeof props.modelValue !== "string") {
    const targetImage = await document.querySelector(`.preview-image`);
    if (props.type == "image") {
      await processImage({ target: { files: [props.modelValue] } }, targetImage);
    }
    const processedImage = props.modelValue;
    fileSelected.value = true;
    emit("update:modelValue", processedImage);
  }
});

const { t } = useI18n();

// * functions

async function processFunction(event: any) {
  try {
    emit("error", "");
    if (event.target.files[0].size > maxSize.value) {
      return emit("error", t("forms.error.maxSizeExceeded", { maxSize }));
    }

    if (props.type === "image") {
      const targetImage = await document.querySelector(`.preview-image`);

      if (initialFile.value) {
        emit("fileUnlinked", initialFile.value);
        initialFile.value = null;
      }

      await processImage(event, targetImage);
      const processedImage = event.target.files[0];

      fileSelected.value = true;

      emit("update:modelValue", processedImage);
    } else {
      if (initialFile.value) {
        emit("fileUnlinked", initialFile.value);
        initialFile.value = null;
      }

      const processedFile = event.target.files[0];

      fileSelected.value = true;
      emit("update:modelValue", processedFile);
    }
  } catch (error: any) {
    console.log(error);
  }
}
function processImage(event: any, fileInputElement: any): any {
  return new Promise<any>((resolve, reject) => {
    try {
      const file = event.target.files[0];

      const fileSize = file.size;
      // if (fileSize > 100000) return
      if (!file) return;
      const targetImage = document.querySelector(`.preview-image-special`) as any;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event: any) {
        const src = event.target.result;
        const canvas = document.createElement("canvas") as any;
        const imgElement = document.createElement("img") as any;
        imgElement.src = src;
        fileInputElement.src = event.target.result;
        targetImage.src = event.target.result;
        targetImage.onload = function (e: any) {
          const scaleSize = 1;
          canvas.width = e.target.width;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
          const compressPer = (data: number) => {
            const result = 10000000 / data;
            if (Math.trunc(result) >= 100) {
              return 100;
            } else if (Math.trunc(result) < 1) {
              return 1;
            } else {
              return Math.trunc(result);
            }
          };

          const srcEncoded = ctx.canvas.toDataURL(
            e.target,
            file.type,
            compressPer(fileSize)
          );
          var blobBin = atob(srcEncoded.split(",")[1]);
          var array = [];
          for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
          }
          const result: any = new Blob([new Uint8Array(array)], {
            type: file.type,
          });

          resolve(result);
        };
      };
    } catch (error: any) {
      reject(error);
    }
  });
}
</script>

<template>
  <div>
    <div class="input-wrapper">
      <label :class="[error ? 'error-file-input' : '']">
        <p v-if="placeholder" class="placeholder">{{ placeholder }}</p>
        <input
          type="file"
          :placeholder="label"
          @change="processFunction"
          :accept="options?.allowedFormats"
        />
        <div
          :class="[
            'file-input-contents-wrapper',
            fileSelected || initialFile ? 'full-input-file' : '',
          ]"
        >
          <span v-if="type === 'image'" class="material-icon round i-xs" disabled
            >image</span
          >
          <span v-else class="material-icon round i-xs" disabled>folder</span>
          <p class="title">
            {{ label }}
          </p>
        </div>
      </label>
      <div v-if="type === 'file' && !fileSelected">
        <nuxt-link :href="modelValue" target="_blank">{{
          t("forms.general.label.selectedFilePreview")
        }}</nuxt-link>
      </div>
      <div
        v-if="type === 'image'"
        v-show="initialFile || fileSelected"
        class="preview-wrapper"
      >
        <img v-if="initialFile" :src="getUrl(initialFile)" :class="`preview-image`" />
        <img v-if="initialFile" :src="getUrl(initialFile)" class="preview-image-special" />
      </div>
      <p class="error-description" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";

</style>
