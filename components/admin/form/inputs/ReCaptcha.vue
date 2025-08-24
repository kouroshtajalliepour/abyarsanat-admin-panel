<template>
  <div>
    <div id="g-recaptcha"></div>
    <div v-if="!captchaLoaded && !captchaLoadError">loading captcha ...</div>
    <div v-if="captchaLoadError">couldn't load captcha</div>
  </div>
</template>

<script setup lang="ts">

const {locale} = useI18n()
useHead({
  script: [
    {
      hid: "recaptcha",
      src:
        `https://www.google.com/recaptcha/api.js?trustedtypes=true?onload=onloadCallback&render=explicit&hl=${locale.value}`,
      defer: true,
    },
  ],
});



const {public: {captchaKey}} = useRuntimeConfig();
const isRecaptchaChecked = ref(false);
const captchaLoaded = ref(false);
const captchaLoadError = ref(false);


const emit = defineEmits(["update:modelValue"]);
const form = reactive({
  token: "",
});

function recaptchaCallback(token: any) {
  isRecaptchaChecked.value = grecaptcha && grecaptcha.getResponse().length !== 0;
  if (isRecaptchaChecked.value) {
    emit("update:modelValue", token);
  }
}

onMounted(() => {
  setTimeout(async () => {
    try {
      await grecaptcha.render("g-recaptcha", {
        // sitekey: "6Lc43xEoAAAAAGnrsjacMBv9Xw2deApBZb-NdJMn",
        sitekey: captchaKey,
        callback: recaptchaCallback,
      });
      captchaLoaded.value = true;
    } catch (e) {
      captchaLoadError.value = true;
    }
  }, 4000);
});
</script>
