<script setup lang="ts">
import { useAdminStore } from "@/store/admin/index";
import { storeToRefs } from "pinia";

const emit = defineEmits(["close"]);

const props = defineProps<{
  old: any;
  new: any;
  operation: string;
  hiddenFields: string[]
  largeFields: string[]
  imageFields: string[]
  tableName: string;
  linkFields: any
  visibleIds: any
}>();

const data = ref([]) as any;

const {t} = useI18n()

onBeforeUnmount(() => {
  document.body.classList.remove("modal-open");
})

onMounted(() => {
  document.body.classList.add("modal-open");
  if (props.old) {
    for (let i = 0; i < Object.keys(props.old).length; i++) {
      const key = Object.keys(props.old)[i];
      if (["created_at", "last_modified_at"].includes(key)) {
        continue;
      }
      const yo: any = {
        key: key,
        old: props.old[key],
      };

      if (props.new) {
        yo.new = props.new[key];
      }

      data.value.push(yo);
    }
  } else {
    for (let i = 0; i < Object.keys(props.new).length; i++) {
      const key = Object.keys(props.new)[i];
      if (["created_at", "last_modified_at"].includes(key)) {
        continue;
      }
      const yo: any = {
        key: key,
        new: props.new[key],
      };

      data.value.push(yo);
    }
  }
});

function isValidUrl(str: string) {
  const matchPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return matchPattern.test(str) || str[0] == '/';
}
// * defining store
const adminStore = useAdminStore();
const { dataPages, multiData: records, imagePreview,contentPreview } = storeToRefs(adminStore);
function openImage(value: string) {
  imagePreview.value = value;
}
function openContent(value: string) {
  contentPreview.value = value;
}
function getLinkFieldsLink(key:string, value:string) {
  return props.linkFields[key].replace('{{ID}}', value)
}
function getIdFieldsLink(key:string, value:string) {
  console.log(key, value)
  return props.visibleIds[key].replace('{{ID}}', value)
}
</script>

<template>
  <div>
    <div @click.self="emit('close')" class="changes-preview-wrapper">
      <div class="my-table-wrapper">
        <table>
          <thead>
            <th>
              {{ t("pages.logPage.tables.heading.field") }}
            </th>
            <th v-if="operation !== 'INSERT'">
              {{ t("pages.logPage.tables.heading.old") }}
            </th>
            <th v-if="operation !== 'DELETE'">
              {{ t("pages.logPage.tables.heading.new") }}
            </th>
          </thead>
          <tbody>
            <tr v-for="(d, index) in data" :key="`changes-made-to-data-${index}`">
              <td v-if="!hiddenFields.includes(d.key) && (d.key !== 'id' || Object.keys(visibleIds).includes(tableName))">{{ t(`entities.fields.${d.key}`) }}</td>
              <td v-if="!hiddenFields.includes(d.key) && operation !== 'INSERT' && (d.key !== 'id' || Object.keys(visibleIds).includes(tableName))">
                <span v-if="typeof d.old === 'boolean'">
                  <span v-if="d.old == true" class="material-icon round i-xs no-cursor"
                    >check</span
                  >
                  <span v-else class="material-icon round i-xs no-cursor">close</span>
                </span>
                <span v-else-if="imageFields.includes(d.key)">
                  <span
                    class="material-icon round i-xs image-previe-button"
                    @click="openImage(d.old)"
                    target="_blank"
                  >
                    image
                  </span>
                </span>
                <span v-else-if="largeFields.includes(d.key)">
                  <span
                    class="material-icon round i-xs image-previe-button"
                    @click="openContent(d.old)"
                    target="_blank"
                  >
                    article
                  </span>
                </span>
                <span v-else-if="Array.isArray(d.old)">
                  <span
                    v-for="(test, index) in d.old"
                    :key="`preview-content-wrapper-${index}`"
                    v-html="test.context"
                  >
                  </span>
                </span>
                <span v-else-if="Object.keys(linkFields).includes(d.key)">
                  <nuxt-link :to="getLinkFieldsLink(d.key, d.old)" target="_blank">
                    <span
                      class="material-icon round i-xs image-previe-button"
                    >
                      open_in_new
                    </span>
                  </nuxt-link>
                </span>
                <span v-else-if="isValidUrl(d.old)">
                  <nuxt-link v-if="d.old" :to="d.old" target="_blank">
                    <span
                      class="material-icon round i-xs image-previe-button"
                    >
                      open_in_new
                    </span>
                  </nuxt-link>
                </span>
                <span v-else-if="d.key === 'id'">
                  <nuxt-link :to="getIdFieldsLink(tableName, d.old)" target="_blank">
                    <span
                      class="material-icon round i-xs image-previe-button"
                    >
                      open_in_new
                    </span>
                  </nuxt-link>
                </span>
                <span v-else> {{ d.old }} {{tableName }}</span>
              </td>
              <td v-if="!hiddenFields.includes(d.key) && operation !== 'DELETE' && (d.key !== 'id' || Object.keys(visibleIds).includes(tableName))">
                <span v-if="d.old !== d.new">
                  <span v-if="typeof d.new === 'boolean'">
                    <span v-if="d.new == true" class="material-icon round i-xs no-cursor"
                      >check</span
                    >
                    <span v-else class="material-icon round i-xs no-cursor">close</span>
                  </span>
                  <span v-else-if="imageFields.includes(d.key)">
                    <span
                      class="material-icon round i-xs image-previe-button"
                      @click="openImage(d.new)"
                      target="_blank"
                    >
                      image
                    </span>
                  </span>
                  <span v-else-if="largeFields.includes(d.key)">
                    <span
                      class="material-icon round i-xs image-previe-button"
                      @click="openContent(d.new)"
                      target="_blank"
                    >
                      article
                    </span>
                  </span>
                  <span v-else-if="Array.isArray(d.new)">
                    <span
                      v-for="(test, index) in d.new"
                      :key="`preview-content-wrapper-${index}`"
                      v-html="test.context"
                    >
                    </span>
                  </span>
                  <span v-else-if="Object.keys(linkFields).includes(d.key)">
                    <nuxt-link :to="getLinkFieldsLink(d.key, d.new)" target="_blank">
                      <span
                        class="material-icon round i-xs image-previe-button"
                      >
                        open_in_new
                      </span>
                    </nuxt-link>
                  </span>
                  <span v-else-if="isValidUrl(d.new)">
                    <nuxt-link v-if="d.new" :to="d.new" target="_blank">
                      <span
                        class="material-icon round i-xs image-previe-button"
                      >
                        open_in_new
                      </span>
                    </nuxt-link>
                  </span>
                  <span v-else-if="d.key === 'id'">
                    <nuxt-link :to="getIdFieldsLink(tableName, d.new)" target="_blank">
                      <span
                        class="material-icon round i-xs image-previe-button"
                      >
                        open_in_new
                      </span>
                    </nuxt-link>
                  </span>
                  <span v-else>{{ d.new }}</span>
                </span>
                <span v-else> ---- </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <pre>{{ old }}</pre>
      <pre>{{new}}</pre> -->
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/helpers/variables";
.changes-preview-wrapper {
  opacity: 0;
  animation: fade-in-dialogue $duration-30 forwards;
  position: fixed;
  top: 0;
  z-index: 8;
  background-color: $white-50;
  backdrop-filter: blur(1px);
  inset: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  padding: 50px !important;
  .wrapper {
    background-color: aqua;
  }
}
.my-table-wrapper {
  overflow: auto;
}
</style>
