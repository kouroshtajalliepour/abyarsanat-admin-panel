<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { useAdminStore } from "@/store/admin/index";
import { useAdminAuthStore } from "@/store/admin/auth";
import { storeToRefs } from "pinia";
import jmoment from "jalali-moment";
const adminStore = useAdminStore();
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken;

const {
  public: {
    senderInfo: { postalCode, phoneNumber },
  },
} = useRuntimeConfig();

const { t, locale } = useI18n();

useHead({
  title: `Abyar Sanaat - Packing List ${jmoment(Date.now())
    .locale("fa")
    .format("YYYY-MM-DD")}`,
});

definePageMeta({
  middleware: ["admin-auth"],
});

const {
  loadedAt,
  recordsFound,
  dataPages,
  multiData: records,
  getLoading,
  imagePreview,
} = storeToRefs(adminStore) as any;

const a4Pages = computed(() => {
  const chunkSize = 4;
  const chunks = [];

  for (let i = 0; i < records.value.length; i += chunkSize) {
    chunks.push(records.value.slice(i, i + chunkSize));
  }

  console.log("🚀 ~ chunks:", chunks);
  return chunks;
});

onMounted(async () => {
  await adminStore.getMultiData({
    lang: locale.value,
    pageSize: 50,
    dataResult: "result",
    dataCountResult: "totalCount",
    preDefined: {
      verified: "1",
      status: "packed",
    },
    url: "/admin/manage/user/order",
    query: {},
  });
  console.log("🚀 ~ recordsFound.value:", recordsFound.value);
  if (recordsFound.value == 0) return;
  await nextTick();
  setTimeout(() => {
    window.print();
  }, 100);
});
</script>

<template>
  <div class="a4-page-wrapper">
    <div v-if="getLoading">loading ...</div>
    <div v-else-if="recordsFound == 0">no data</div>
    <div v-else v-for="page in a4Pages" class="a4-page">
      <div v-for="i in 4" class="order-label-wrapper">
        <div class="order-label">
          <AdminChangeableIconsLogo class="logo-wrapper" index="1" />
          <div class="recipient-info-wrapper">
            <h3 v-if="page[i - 1]?.shipment_method" class="shipment-method-heading">
              {{
                t(
                  `entities.values.shipmentMethods.${
                    page[i - 1]?.shipment_method || "NA"
                  }.title`
                )
              }}
            </h3>
            <h3>{{ t("entities.fields.recipient_info") }}</h3>
            <p class="inline-info">
              <strong>{{ t("entities.fields.id") }}:</strong
              >{{ ` ${page[i - 1]?.payment_id || ""}` }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.recipient") }}:</strong
              >{{
                ` ${page[i - 1]?.recipient_first_name || ""} ${
                  page[i - 1]?.recipient_last_name || ""
                }`
              }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.phone_number") }}:</strong
              >{{ ` ${page[i - 1]?.recipient_phone_number || ""}` }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.postal_code") }}:</strong
              >{{ ` ${page[i - 1]?.postal_code || ""}` }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.full_address") }}:</strong
              >{{ ` ${page[i - 1]?.full_address || ""}` }}
            </p>
          </div>
          <div class="sender-info-wrapper">
            <div class="sender-info">
              <p class="inline-info">
                <strong>{{ t("entities.fields.sender") }}:</strong
                >{{ ` ${t("projectName")}` }}
              </p>
              <p class="inline-info">
                <strong>{{ t("entities.fields.postal_code") }}:</strong
                >{{ ` ${postalCode}` }}
              </p>
              <p class="inline-info">
                <strong>{{ t("entities.fields.phone") }}:</strong>{{ ` ${phoneNumber}` }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/global.scss";
* {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  padding: 0;
  margin: 0;
}
@page {
  size: A4 landscape;
  margin: 0;
}

.a4-page {
  height: 210mm;
  width: 297mm;
  display: flex;
  align-items: center;
  background-color: white;
  flex-wrap: wrap;
  .order-label-wrapper {
    height: calc((210mm / 2) - 2px);
    width: calc((297mm / 2) - 2px);
    .order-label {
      margin: 20px;
      height: calc(100% - 40px);
      width: calc(100% - 40px);
      position: relative;
      direction: rtl;
      font-family: "Pinar";
      display: flex;
      h3 {
        font-size: 1.3em;
        margin-bottom: 20px;
      }
      .recipient-info-wrapper {
        display: flex;
        flex-direction: column;
        border-left: 1px solid black;
        width: calc(100% - 200px);
        padding: 20px;
        position: relative;
        .shipment-method-heading {
          position: absolute;
          left: 10px;
          top: 0;
          font-size: 1.2em;
          // background-color: red;
        }
        .inline-info {
          margin-bottom: 10px;
        }
      }
      .sender-info-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 200px;
        .inline-info {
          display: inline-flex;
          justify-content: space-between;
          width: 165px;
          margin-bottom: 10px;
        }
        .sender-info {
          margin-right: 20px;
        }
      }
      .logo-wrapper {
        position: absolute;
        svg {
          width: auto;
          height: 50px;
          fill: $primary;
        }
        left: 0px;
        top: 0px;
      }
    }
  }
  .order-label-wrapper:nth-child(4n + 1) {
    border-right: 1px dashed black;
    border-bottom: 1px dashed black;
  }
  .order-label-wrapper:nth-child(4n + 2) {
    border-bottom: 1px dashed black;
  }
  .order-label-wrapper:nth-child(4n + 3) {
    border-right: 1px dashed black;
  }
}
</style>
