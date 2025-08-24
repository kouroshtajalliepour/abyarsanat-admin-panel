<script setup lang="ts">
const {locale, locales, t} = useI18n()
import { useAdminStore } from "@/store/admin/index";
const adminStore = useAdminStore()
import { useUrl } from "~/composables/useUrl";
const { getUrl } = useUrl();

function getDir() {
  const yo: any = locales.value;
  return yo.filter((item: any) => {
    return item.code === locale.value;
  })[0].dir;
}

// * props
const props = defineProps<{
    carousel: {
        field: string;
        imageField?: string;
        imageSize?: {
            width: string
            height: string
        }
        textField?: string | {default: string, alt: string}
        apiBaseUrl: string
        identifier: string
        preDefined?: any
        localized?: boolean;
        inputs: any
    };
    slides?: any;
}>();

// * resolved components
const AdminFormMultiPageForm = resolveComponent("AdminFormMultiPageForm");
const AdminFormSinglePageForm = resolveComponent("AdminFormSinglePageForm");

// * data
const selectedSlide = ref({}) as any;
const askedToDelete = ref(false);
const askedToEdit = ref(false);
const askedToCreate = ref(false);
const askedToMove = ref(false);
const deleteInputs = ref([
  {
    type: "text",
    label: t("forms.deleteConfirmation"),
    name: "confirmation",
    value: "",
    required: true,
    error: "",
    options: {
      
    },
  },
]) as any;
const moveInputs = ref([
    {
    type: "select",
    label: t("entities.fields.index_number"),
    name: "index_number",
    value: '',
    error: "",
    options: {
      nameKey: "key",
      valueKey: "value",
      options: [],
    },
  },
]) as any;

const selectedLocale = ref('')
const selectedSlides = ref(null) as any
const loadingCarousels = ref(false)

await onBeforeMount(async() => {
    selectedLocale.value = locale.value
    selectedSlides.value = props.slides
})

// * functions
function getSlideImage(slide:any) {
    if(props.carousel?.imageField){
        return slide[props.carousel.imageField]
    }
}
function askToEdit(slide:any){
    if(loadingCarousels.value){
        return
    }
    selectedSlide.value = slide
    for (let i = 0; i < props.carousel?.inputs.length; i++) {
      const input = props.carousel?.inputs[i];
      if (slide[input.name]) {
        input.value = slide[input.name];
      } else {
        input.value = null;
      }
      if (input.fieldToExtractFrom) {
        input.value = slide[input.fieldToExtractFrom];
      }
    }
    askedToEdit.value = true;
}
function askToDelete(slide:any){
    if(loadingCarousels.value){
        return
    }
    selectedSlide.value = slide
    askedToDelete.value = true;
}
function askToMove(slide:any, index:any){
    if(loadingCarousels.value){
        return
    }
    selectedSlide.value = slide
    moveInputs.value[0].value = index + 1
    askedToMove.value = true;

    const options = []
    for (let i = 0; i < selectedSlides.value.length; i++) {
        options.push({
          key: (i + 1).toString(),
          value: (i + 1).toString(),
        })   
    }
    moveInputs.value[0].options.options = options

}

function askToCreate(){
    if(loadingCarousels.value){
        return
    }
    for (let i = 0; i < props.carousel?.inputs.length; i++) {
      const input = props.carousel?.inputs[i];
      input.value = null;
    }
    askedToCreate.value = true;
}

async function submitEdit(data:any){
    try {
        if(loadingCarousels.value){
            return
        }
        const updatedRecord = await adminStore.updateData({
            data,
            lang: locale.value,
            url: props.carousel?.apiBaseUrl,
            useCsrf: false,
            identifier: selectedSlide.value[props.carousel.identifier],
            dataResult: "result",
            fieldsToUpload: [],
        });
        location.reload();
    } catch (error:any) {
        console.log(error)
    }
}
async function submitCreate(data:any){
    try {
        if(loadingCarousels.value){
            return
        }
        const preDefined = {
            ...props.carousel?.preDefined, 
            index_number: selectedSlides.value.length ? (Number(selectedSlides.value[selectedSlides.value.length - 1].index_number) + 1).toString(): '1'
        }
        if (props.carousel.localized) {
            preDefined.locale = selectedLocale.value
        }

        const result = await adminStore.createData({
            data,
            lang: locale.value,
            url: props.carousel?.apiBaseUrl,
            fieldsToUpload: [],
            preDefined,
            useCsrf: false,
        });
        selectedSlides.value.push(result)
        askedToCreate.value = false
    } catch (error:any) {
        console.log(error)
    }
}
async function submitDelete(data:any){
    try {
        if(loadingCarousels.value){
            return
        }
        await adminStore.deleteData({
            lang: locale.value,
            identifier: selectedSlide.value[props.carousel.identifier],
            url: props.carousel.apiBaseUrl,
        });
        location.reload();
    } catch (error:any) {
        console.log(error)
    }
}
async function submitMove(data:any){
    try {
        if(loadingCarousels.value){
            return
        }
        const currentIndex = Number(selectedSlide.value?.index_number)

        const selectedIndex = data.index_number

        if(!currentIndex || currentIndex == selectedIndex) {
            askedToMove.value = false
            return
        }

        const slideWithSelectedIndex = selectedSlides.value[selectedIndex - 1]
        await adminStore.updateData({
            data: {
                index_number: currentIndex.toString(),
            },
            lang: locale.value,
            url: props.carousel?.apiBaseUrl,
            useCsrf: false,
            identifier: slideWithSelectedIndex[props.carousel.identifier],
            dataResult: "result",
            fieldsToUpload: [],
        });
        await adminStore.updateData({
            data: {
                index_number: slideWithSelectedIndex.index_number
            },
            lang: locale.value,
            url: props.carousel?.apiBaseUrl,
            useCsrf: false,
            identifier: selectedSlide.value[props.carousel.identifier],
            dataResult: "result",
            fieldsToUpload: [],
        });
        location.reload();
        
    } catch (error:any) {
        console.log(error)
    }
}
async function getSlides(locale: string){
    if (locale === selectedLocale.value) {
        return
    }

    loadingCarousels.value = true
    selectedLocale.value = locale

    try {
        await adminStore.getMultiData({
            lang: locale,
            dataResult: "result",
            dataCountResult: "totalCount",
            preDefined: props.carousel.preDefined,
            url: props.carousel.apiBaseUrl,
            query: {
                locale,
                orderBy: "index_number asc"
            },
        });

        if (!adminStore.multiData || !adminStore.multiData.length) {
            selectedSlides.value = []
        }else{
            selectedSlides.value = adminStore.multiData
        }

        loadingCarousels.value = false
    } catch (error:any) {
        console.log(error)
    }
}

</script>
<template>
    <div>
        <AdminModal
            v-if="askedToCreate"
            :dialogueTitle="t('forms.editCarousel.createQuote')"
            @close="
                askedToCreate = false;
            "
        >
            <div class="inputs">
                <component
                :is="
                    Array.isArray(carousel?.inputs) &&
                    carousel?.inputs.length &&
                    carousel?.inputs[0] &&
                    carousel?.inputs[0].inputs
                    ? AdminFormMultiPageForm
                    : AdminFormSinglePageForm
                "
                :inputPages="carousel?.inputs"
                :inputs="carousel?.inputs"
                :submitFunction="submitCreate"
                />
            </div>
        </AdminModal>
        <AdminModal
            v-if="askedToEdit"
            :dialogueTitle="t('forms.editCarousel.title')"
            @close="
                askedToEdit = false;
            "
        >
            <div class="inputs">
                <component
                :is="
                    Array.isArray(carousel?.inputs) &&
                    carousel?.inputs.length &&
                    carousel?.inputs[0] &&
                    carousel?.inputs[0].inputs
                    ? AdminFormMultiPageForm
                    : AdminFormSinglePageForm
                "
                :inputPages="carousel?.inputs"
                :inputs="carousel?.inputs"
                :submitFunction="submitEdit"
                />
            </div>
        </AdminModal>
        <AdminModal
            v-if="askedToDelete"
            :dialogueTitle="t('forms.editCarousel.deleteQuote')"
            @close="askedToDelete = false"
        >
        <div class="inputs">
            <h3>{{ t("forms.general.heading.delete") }}</h3>
            <component
            :is="
                Array.isArray(deleteInputs) &&
                deleteInputs.length &&
                deleteInputs[0] &&
                deleteInputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="deleteInputs"
            :inputs="deleteInputs"
            :submitFunction="submitDelete"
            />
        </div>
        </AdminModal>
        <AdminModal
            v-if="askedToMove"
            :dialogueTitle="t('forms.editCarousel.moveQuote')"
            @close="askedToMove = false"
        >
        <div class="inputs">
            <component
            :is="
                Array.isArray(moveInputs) &&
                moveInputs.length &&
                moveInputs[0] &&
                moveInputs[0].inputs
                ? AdminFormMultiPageForm
                : AdminFormSinglePageForm
            "
            :inputPages="moveInputs"
            :inputs="moveInputs"
            :submitFunction="submitMove"
            />
        </div>
        </AdminModal>
        <div v-if="carousel.localized" class="carousel-lang-switcher-wrapper">
            <button 
                type="button" 
                :class="[l.code === selectedLocale ? 'active' : '']" 
                v-for="l in (locales as any)"
                @click="getSlides(l.code)"
            >
                {{ l.displayName }}
            </button>
        </div>
        <div v-if="loadingCarousels">
            <h3 class="loading-quote">loading ...</h3>
        </div>
        <div v-else class="carousel-wrapper image-slider">
            <NuxtCarousel :dir="getDir()" :items-to-show="2.5" :wrap-around="true">
            <NuxtSlide v-for="(slide, index) in selectedSlides" :key="slide">
                <div class="carousel__item">
                    <div class="controls-wrapper">
                        <button @click="askToEdit(slide)" type="button">
                            <span  class="material-icon i-xs round">edit</span>
                        </button>
                        <button @click="askToDelete(slide)" type="button">
                            <span class="material-icon i-xs round">delete</span>
                        </button>
                        <button @click="askToMove(slide, index)" type="button">
                            <span  class="material-icon i-xs round">sync_alt</span>
                        </button>
                    </div>
                    <img  v-if="getSlideImage(slide)" :src="getUrl(getSlideImage(slide))"/>
                    <p v-if="carousel?.textField">{{ typeof carousel.textField === 'string' ? slide[carousel.textField] : slide[carousel.textField.default] ? slide[carousel.textField.default] : slide[carousel.textField.alt]}}</p>
                </div>
                
            </NuxtSlide>
            <NuxtSlide v-for="slide in 1" key="slide_special">
                <div class="carousel__item add__item" @click="askToCreate" >
                <span class="material-icon round i-xs">
                    add
                </span>
                <p>{{ t("forms.editCarousel.createQuote") }}</p>
                </div>
            </NuxtSlide>

            <template #addons>
                <NuxtNavigation />
                <NuxtPagination />
            </template>
            </NuxtCarousel>
        </div>
    </div>
</template>

<style lang="scss">
  @import "@/assets/scss/admin/global.scss";
  @import "@/assets/scss/carousel";

  .admin-body{
    .carousel-lang-switcher-wrapper{
    display: flex;
    button{
        width: 96px;
        height: 48px;
        background-color: rgba(61, 58, 58, 0.15) !important;
        margin: 10px;
        border: 1px solid rgba(61, 58, 58, 0.15) !important;
        border-radius: 5px;
        &.active{
            color: $primary !important;
            border-color: $primary !important;
        }
    }
  }

  .loading-quote{
    margin: 20px;
  }
  }
</style>