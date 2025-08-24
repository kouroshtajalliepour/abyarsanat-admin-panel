<script setup lang="ts">
import { computed, ref } from "vue";

// * data
const fullscreen = ref(false);

// * props
const props = defineProps<{
  dialogueTitle?: string;
  enableLangSwitch?: boolean;
  parentClass?: string;
}>();
const emit = defineEmits(["close"]);

const dialogueContents = ref(null) as any;

onMounted(() => {
  if (!props.parentClass) {
    document.body.classList.add("modal-open");
  } else {
    const elements = document.getElementsByClassName(props.parentClass);
    elements[0].classList.add("modal-open");
  }
});
onUnmounted(() => {
  if (!props.parentClass) {
    document.body.classList.remove("modal-open");
  } else {
    const elements = document.getElementsByClassName(props.parentClass);
    elements[0].classList.remove("modal-open");
  }
})

// * functions
function closeDialogue(): void {
  if (!props.parentClass) {
    document.body.classList.remove("modal-open");
  } else {
    const elements = document.getElementsByClassName(props.parentClass);
    elements[0].classList.remove("modal-open");
  }
  emit("close");
}
</script>

<template>
  <div @click.self="closeDialogue" :class="['data-wizard-dialogue-component', fullscreen ? 'fullscreen' : '']">
    <div
      :class="['dialogue-window-frame-wrapper', !parentClass ? 'admin-page-modal' : '']"
    >
      <div class="data-wizard-wrapper">
        <div class="dialogue-title-wrapper">
          <h5 class="dialogue-title">{{ dialogueTitle }}</h5>
          <button
            type="button"
            class="fullscreen-dialogue"
            @click="fullscreen = !fullscreen"
          >
            <span v-if="!fullscreen" class="material-icon round i-xs"
              >fullscreen_exit</span
            >
            <span v-if="fullscreen" class="material-icon round i-xs"
              >fullscreen_exit</span
            >
          </button>
          <button type="button" class="close-dialogue" @click="closeDialogue">
            <span class="material-icon round i-xs">close</span>
          </button>
        </div>
        <div class="dialogue-contents-wrapper" ref="dialogueContents">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";
.data-wizard-dialogue-component {
  opacity: 0;
  animation: fade-in-dialogue $duration-30 forwards;
  position: fixed;
  top: 0;
  z-index: 7;
  background-color: $white-50;
  backdrop-filter: blur(10px);
  inset: 0;
  display: grid;
  place-items: center;
  &.fullscreen {
    .dialogue-window-frame-wrapper {
      min-height: 100%;
      min-width: 100%;
    }
  }
  .dialogue-window-frame-wrapper {
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    overflow-x: hidden;
    transform: scale(0.95);
    opacity: 0;
    animation: scale-in-dialogue $duration-30 forwards;
    min-width: 600px;
    min-height: 0px;
    box-shadow: $xs-smooth-shadow;
    transition: all $duration-30;
    background-color: $white;
    padding: 0 $lg-white-space $lg-white-space;
    border-radius: 5px;
    border: 1px solid $coral-black-15;
    transition: min-height $duration-15, min-width $duration-15;
    @include md {
      min-width: 100%;
      max-width: 100%;
    }
  }
  .dialogue-title-wrapper {
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    align-items: center;
    padding-top: $lg-white-space;
    padding-bottom: $std-white-space;
    border-bottom: 1px solid $coral-black-15;
    margin-bottom: 25px;
    z-index: 6;
    background-color: white;
  }
  h5.dialogue-title {
    color: $light-coral-black;
    font-weight: 400;
    font-size: 24px;
  }
  button.close-dialogue,
  button.fullscreen-dialogue {
    background-color: transparent;
  }
  button.fullscreen-dialogue {
    margin-left: auto;
    margin-right: $std-white-space;
  }
  .dialogue-contents-wrapper {
    display: flex;
    > * {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: stretch;
      @include relative-child-margin($std-white-space, -bottom);
    }
    @include relative-child-margin($std-white-space, -right);
  }
  h6.dialogue-page-title {
    color: $light-coral-black;
    font-weight: 300;
    font-size: 18px;
  }
  .dialogue-control-buttons-wrapper {
    margin-top: $xlg-white-space;
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    @include relative-child-margin($std-white-space, -right);
    .dialogue-lang-switcher {
      flex-grow: 1;
    }
  }
}
@keyframes scale-in-dialogue {
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes fade-in-dialogue {
  100% {
    opacity: 1;
  }
}
</style>
