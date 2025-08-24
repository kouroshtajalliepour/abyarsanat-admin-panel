<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useAdminStore } from "@/store/admin/index";
const adminStore = useAdminStore();

const { t } = useI18n();

// * refrences
const {
  makeValidateUrl
} = useValidators()

const selectedColor = ref("");
const selectedHighlightColor = ref("");
const initialImages = ref([]) as any;
const showImageInput = ref(false);
const showLinkInput = ref(false);
const imageInputs = ref([
  {
    type: "filePicker",
    label: t("entities.fields.image_url"),
    name: "image_url",
    required: true,
    error: "",
    options: {
      imageFormats: ["image/png", "image/jpeg", "image/gif"],
      allowedFormats: ["image/png", "image/jpeg", "image/gif"],
    },
  },
]);

const linkInputs = ref([
  {
    type: "text",
    label: t("entities.fields.url"),
    name: "url",
    options: {
      mode: "url",
      alwaysLtr: "true"
    },
    value: "",
    required: true,
    error: "",
    validator: makeValidateUrl(true)
  },
])

// * defining props emits
const emit = defineEmits(["update:modelValue", "imageUnlinked", "remove", "imageLinked"]);

const props = defineProps<{
  removeIsAvailable?: boolean;
  modelValue: String;
  label: String;
}>();
// * defining editor

const editor: any = useEditor({
  content: props.modelValue,

  extensions: [
    // StarterKit
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }) as any,
    Link.configure({
      openOnClick: true,
    }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Underline,
    Subscript,
    Superscript,
    Image.configure({
      allowBase64: false,
      HTMLAttributes: {
        class: "uploaded-images",
      },
    }),
    TextStyle,
    Color,
  ],

  onCreate: () => {
    const result = getCurrentImages();
    initialImages.value = result;
  },

  onUpdate: () => {
    const result = getCurrentImages();

    for (let i = 0; i < initialImages.value.length; i++) {
      const imageUrl = initialImages.value[i];
      if (!result.includes(imageUrl)) {
        emit("imageUnlinked", imageUrl);
      }
    }
    emit("update:modelValue", editor.value.getHTML());
  },
});

// * watching for editor changes

watch(
  () => props.modelValue,
  () => {
    try {
      const isSame = editor.value.getHTML() === props.modelValue;
      if (isSame) {
        return;
      }

      editor.value.commands.setContent(props.modelValue, false);
    } catch (error: any) {
      console.log(error);
    }
  }
);

// * before destroy (unmount)

onBeforeUnmount(() => {
  editor.value.destroy();
});

// * functions
function getCurrentImages(): string[] {
  const result: any = [];
  const imgElements: any = document.getElementsByClassName("uploaded-images");
  for (let i = 0; i < imgElements.length; i++) {
    const imgElement = imgElements[i];
    result.push(imgElement.src);
  }
  return result;
}
function setLink() {
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();

    return;
  }

  // update link
  editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function addImage() {
  const yo = document.getElementsByClassName("admin-page-modal")[0];
  yo.scrollTo({ top: 0 });
  showImageInput.value = true;
}
function addLink() {
  const yo = document.getElementsByClassName("admin-page-modal")[0];
  yo.scrollTo({ top: 0 });
  showLinkInput.value = true;
}

function changeColor() {
  editor.value.chain().focus().setColor(selectedColor.value).run();
}
function changeHighlightColor() {
  editor.value
    .chain()
    .focus()
    .toggleHighlight({ color: selectedHighlightColor.value })
    .run();
}
function removeColors() {
  editor.value.chain().focus().unsetColor().run();
  editor.value.chain().focus().unsetHighlight().run();
}
async function addImageSubmit(receivedData: any) {
  try {
    const { image_url } = receivedData;
    editor.value.chain().focus().setImage({ src: image_url }).run();
    const elements = document.getElementsByClassName("admin-page-modal");
    console.log("🚀 ~ file: HtmlEditor.vue:197 ~ addImageSubmit ~ elements:", elements)
    elements[0].classList.remove("modal-open");
    showImageInput.value = false;
  } catch (error) {
    console.log("🚀 ~ file: HtmlEditor.vue:183 ~ addImageSubmit ~ error:", error);
    throw error;
  }
  // showImageInput.value = false;
}
async function addLinkSubmit(receivedData: any) {
  try {
    const { url } = receivedData;
    if (url === null) {

    }else if (url === "") {
      editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    }else {
      editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }

  // update link
    const elements = document.getElementsByClassName("admin-page-modal");
    elements[0].classList.remove("modal-open");
    showLinkInput.value = false;
  } catch (error) {
    console.log("🚀 ~ file: HtmlEditor.vue:183 ~ addImageSubmit ~ error:", error);
    throw error;
  }
  // showImageInput.value = false;
}
</script>

<template>
  <div>
    <AdminModal
      v-if="showImageInput"
      :dialogueTitle="t('buttons.addImage')"
      @close="showImageInput = false"
      parentClass="admin-page-modal"
    >
      <div class="inputs">
        <AdminFormSinglePageForm :inputs="imageInputs" :submitFunction="addImageSubmit" />
      </div>
    </AdminModal>
    <AdminModal
      v-if="showLinkInput"
      :dialogueTitle="t('buttons.addLink')"
      @close="showLinkInput = false"
      parentClass="admin-page-modal"
    >
      <div class="inputs">
        <AdminFormSinglePageForm :inputs="linkInputs" :submitFunction="addLinkSubmit" />
      </div>
    </AdminModal>
    <p class="textarea-title">
      {{ label }}
      <button v-if="removeIsAvailable" type="button" @click="$emit('remove')">
        <span class="material-icon remove-button">remove</span>
      </button>
    </p>
    <div class="content-editor-wrapper">
      <div class="text-editors" v-if="editor">
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          <span class="heading_name">H1</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          <span class="heading_name">H2</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          <span class="heading_name">H3</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
        >
          <span class="material-icon round i-xs">code</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <span class="material-icon round i-xs">format_bold</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <span class="material-icon round i-xs">format_italic</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <span class="material-icon round i-xs">format_strikethrough</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleUnderline().run()"
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          <span class="material-icon round i-xs">format_underlined</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleSuperscript().run()"
          :class="{ 'is-active': editor.isActive('superscript') }"
        >
          <span class="material-icon round i-xs">superscript</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleSubscript().run()"
          :class="{ 'is-active': editor.isActive('subscript') }"
        >
          <span class="material-icon round i-xs">subscript</span>
        </button>
      </div>
      <div class="alignment-editors" v-if="editor">
        <button
          type="button"
          @click="editor.chain().focus().setTextAlign('left').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        >
          <span class="material-icon round i-xs">format_align_left</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().setTextAlign('center').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        >
          <span class="material-icon round i-xs">format_align_center</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().setTextAlign('right').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        >
          <span class="material-icon round i-xs">format_align_right</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
        >
          <span class="material-icon round i-xs">format_align_justify</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <span class="material-icon round i-xs">format_list_bulleted</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <span class="material-icon round i-xs">format_list_numbered</span>
        </button>
      </div>
      <div class="color-editors" v-if="editor">
        <div class="color-input-wrapper">
          <label for="colorpicker">
            <span class="material-icon round i-xs">format_color_text</span>
          </label>
          <input
            class="color-input"
            type="color"
            id="colorpicker"
            @change="changeColor"
            v-model="selectedColor"
          />
        </div>
        <div class="color-input-wrapper">
          <label for="highlightcolorpicker">
            <span class="material-icon round i-xs">format_color_fill</span>
          </label>
          <input
            class="color-input"
            type="color"
            id="highlightcolorpicker"
            @change="changeHighlightColor"
            v-model="selectedHighlightColor"
          />
        </div>
        <button type="button" @click="removeColors">
          <span class="material-icon round i-xs">invert_colors_off</span>
        </button>
      </div>
      <div class="attachment-editors" v-if="editor">
        <button type="button" @click="addImage">
          <span class="material-icon round i-xs">add_photo_alternate</span>
        </button>
        <button
          type="button"
          @click="addLink"
          :class="{ 'is-active': editor.isActive('link') }"
          :disabled="editor.isActive('link')"
        >
          <span class="material-icon round i-xs">add_link</span>
        </button>
        <button
          type="button"
          @click="editor.chain().focus().unsetLink().run()"
          :disabled="!editor.isActive('link')"
        >
          <span class="material-icon round i-xs">link_off</span>
        </button>
      </div>
    </div>
      <!-- <bubble-menu
      v-show="!showImageInput"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
      class="bubble"
    > -->
        <!-- <button @click="editor.chain().focus().setColor('#B9F18D').run()" :class="{ 'is-active': editor.isActive('textStyle', { color: '#B9F18D' })}">
          <span class="material-icon round i-xs">format_color_text</span>
        </button> -->
        <!-- <button @click="editor.chain().focus().toggleHighlight({ color: '#b197fc' }).run()" :class="{ 'is-active': editor.isActive('highlight', { color: '#b197fc' }) }">
          <span class="material-icon round i-xs">format_color_fill</span>
        </button> -->
    
    <!-- </bubble-menu> -->
    <!-- <floating-menu
      v-show="!showImageInput"
      class="floating"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    > -->
    <!-- </floating-menu> -->
    <editor-content class="sp-textarea-component" :editor="editor" />
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
@import "@/assets/scss/admin/form";
@import "@/assets/scss/admin/formHTMLeditor";

</style>
