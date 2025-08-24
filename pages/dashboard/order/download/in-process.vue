<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { useAdminStore } from "@/store/admin/index";
import jmoment from "jalali-moment";
import { storeToRefs } from "pinia";
const adminStore = useAdminStore();
import { useAdminAuthStore } from "@/store/admin/auth";
const adminAuth = useAdminAuthStore() as any;
const token = adminAuth.authToken;

const {
  public: {
    websiteName,
    senderInfo: { postalCode, phoneNumber },
  },
} = useRuntimeConfig();

const { t, locale } = useI18n();
useHead({
  title: `Abyar Sanaat - Invoices ${jmoment(Date.now())
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

// const mockData = ref({
//   id: 1,
//   phone_number: "09101777753",
//   postal_code: "1234876822",
//   first_name: "کورش",
//   last_name: "تجلی پور",
//   full_address: "تهران صادقیه، بلوار فلان، اونیکی کوچه فلان پلاک زنگ ۲۰",
// });

const a4Pages = computed(() => {
  const chunkSize = 13;

  const chunks = [];

  for (let i = 0; i < records.value.length; i++) {
    const {
      payment_id,
      recipient_first_name,
      recipient_last_name,
      recipient_phone_number,
      total_discounted_amount,
      promotion_slug,
      promotion_discount_percentage,
      promotion_discount_price,
      total_promoted_amount,
      total_count,
      created_at,
      cart_items,
    } = records.value[i];
    let pageNumber = cart_items.length > chunkSize ? 0 : undefined;
    let isLastPage = true;

    for (let j = 0; j < cart_items.length; j += chunkSize) {
      if (typeof pageNumber === "number") {
        pageNumber++;
      }
      if (cart_items.length - j > chunkSize) {
        isLastPage = false;
      }
      chunks.push({
        payment_id,
        isLastPage,
        recipient_first_name,
        recipient_last_name,
        recipient_phone_number,
        total_promoted_amount,
        total_discounted_amount,
        promotion_slug,
        promotion_discount_percentage,
        promotion_discount_price,
        total_count,
        created_at,
        pageNumber,
        cart_items: cart_items.slice(j, j + chunkSize),
      });
    }
  }

  return chunks;
});
function formatPrice(number: number) {
  const str = number.toString();
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

onMounted(async () => {
  await adminStore.getMultiData({
    lang: locale.value,
    pageSize: 50,
    dataResult: "result",
    dataCountResult: "totalCount",
    preDefined: {
      verified: "1",
      status: "in-process",
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
      <div class="order-label-wrapper">
        <div class="order-header">
          <div class="header-information">
            <p class="inline-info">
              <strong>{{ t("entities.fields.date") }}:</strong
              >{{ ` ${jmoment(page.created_at).locale(locale).format("YYYY-MM-DD")}` }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.payment_id") }}:</strong
              >{{ ` ${page.payment_id}` }}
            </p>
            <p v-if="page.pageNumber" class="inline-info">
              <strong>{{ t("entities.fields.index") }}:</strong
              >{{ ` ${page.pageNumber}` }}
            </p>
          </div>
          <div class="logo-wrapper">
            <AdminChangeableIconsLogo index="1" />
            <!-- <p>{{ websiteName }}</p> -->
          </div>
        </div>
        <div class="order-title-wrapper">
          <h3 class="order-title">{{ t("entities.fields.invoice_title") }}</h3>
        </div>
        <div class="order-product-table-wrapper">
          <client-only>
            <table class="order-product-table">
              <tr class="table-row-wrapper header">
                <th class="table-row row header">{{ t("entities.fields.row") }}</th>
                <th class="table-row product-name header">
                  {{ t("entities.fields.product_name") }}
                </th>
                <th class="table-row quantity header">
                  {{ t("entities.fields.quantity") }}
                </th>
                <th class="table-row price header">{{ t("entities.fields.fee") }}</th>
                <th class="table-row price header">
                  {{ t("entities.fields.total_amount") }}
                </th>
              </tr>
              <tr class="table-row-wrapper" v-for="i in 13">
                <td class="table-row row">
                  <div class="td-wrapper">
                    <span v-if="page.cart_items[i - 1]?.name">{{ i }}</span>
                    <!-- <img
                      v-if="page.cart_items[i - 1]?.name"
                      :src="
                        page.cart_items[i - 1]?.selectedModel?.image_url ||
                        page.cart_items[i - 1]?.image_url ||
                        '/images/logo.png'
                      "
                    /> -->
                  </div>
                </td>
                <td class="table-row product-name">
                  <div class="td-wrapper">
                    <p>
                      {{ page.cart_items[i - 1]?.name }}
                      <span v-if="page.cart_items[i - 1]?.selectedModel?.name"
                        >({{ page.cart_items[i - 1].selectedModel.name }})</span
                      >
                    </p>
                  </div>
                </td>
                <td class="table-row quantity">
                  <div class="td-wrapper">
                    {{ page.cart_items[i - 1]?.quantity }}
                  </div>
                </td>
                <td class="table-row price">
                  <div
                    v-if="page.cart_items[i - 1]?.selectedModel?.discounted_price"
                    class="td-wrapper"
                  >
                    {{
                      formatPrice(
                        Number(page.cart_items[i - 1].selectedModel.discounted_price)
                      )
                    }}
                  </div>
                </td>
                <td class="table-row price">
                  <div
                    v-if="page.cart_items[i - 1]?.selectedModel?.discounted_price"
                    class="td-wrapper"
                  >
                    {{
                      formatPrice(
                        Number(page.cart_items[i - 1].selectedModel.discounted_price) *
                          Number(page.cart_items[i - 1].quantity)
                      )
                    }}
                  </div>
                </td>
              </tr>
            </table>
          </client-only>
          <div class="total-count-row">
            <div v-if="page.isLastPage" class="total-count-row-title quantity-sum">
              {{ t("entities.fields.total_count") }}
            </div>
            <div v-if="page.isLastPage" class="total-count-row-title quantity-sum-value">
              {{ formatPrice(Number(page.total_discounted_amount)) }}
            </div>
          </div>
        </div>

        <div class="order-extra-info">
          <p
            v-if="
              page.promotion_slug && page.isLastPage && page.promotion_discount_percentage
            "
            class="inline-info"
          >
            <strong>
              {{
                t("entities.promotionApplied.percentage", {
                  amount: page.promotion_discount_percentage,
                  slug: page.promotion_slug,
                })
              }}:
            </strong>
            {{ ` ${formatPrice(Number(page.total_promoted_amount))}` }}
          </p>
          <p
            v-if="page.promotion_slug && page.isLastPage && page.promotion_discount_price"
          >
            <strong>
              {{
                t("entities.promotionApplied.price", {
                  amount: formatPrice(Number(page.promotion_discount_price)),
                  slug: page.promotion_slug,
                })
              }}:
            </strong>
            {{ ` ${formatPrice(Number(page.total_promoted_amount))}` }}
          </p>
        </div>

        <div class="order-footer">
          <div class="order-footer-info">
            <p class="inline-info">
              <strong>{{ t("entities.fields.websiteName") }}:</strong
              >{{ ` ${websiteName}` }}
            </p>
            <p class="inline-info">
              <strong>{{ t("entities.fields.phone") }}:</strong>{{ ` ${phoneNumber}` }}
            </p>
          </div>
          <div class="order-footer-signature">
            {{ t("entities.fields.inventoryCheck") }}
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
  size: A4;
  margin: 0;
}

.a4-page {
  width: 210mm;
  height: 297mm;
  display: flex;
  align-items: center;
  background-color: white;
  flex-wrap: wrap;
  .order-label-wrapper {
    height: calc(100% - 60px);
    width: calc(100% - 60px);
    overflow: hidden;
    // background-color: yellow;
    direction: rtl;
    font-family: "Pinar";
    padding: 30px;
    .inline-info {
      display: inline-flex;
      justify-content: space-between;
      width: 200px;
      margin-bottom: 10px;
    }
    .order-header {
      height: 100px;
      display: flex;
      justify-content: space-between;
      .header-information {
        align-self: center;
        flex-direction: column;
        display: flex;
      }
      .logo-wrapper {
        svg {
          width: auto;
          height: 50px;
          fill: $primary;
        }
      }
    }
    .order-extra-info {
      margin-top: 20px;
      padding-right: 20px;
      height: 25px;
    }
    .order-footer {
      //   height: 100px;
      margin-top: 20px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      .order-footer-info {
        align-self: center;
        flex-direction: column;
        display: flex;
        .inline-info {
          width: 250px;
        }
      }
      .order-footer-signature {
        width: 50%;
        align-self: center;
        text-align: center;
      }
    }
    .order-title-wrapper {
      display: flex;
      justify-content: center;
      .order-title {
        font-size: 2em;
      }
    }
    .order-product-table-wrapper {
      .order-product-table {
        width: 100%;
        margin-top: 30px;

        .table-row-wrapper {
          border-bottom: 1px solid black;

          .table-row {
            //   border-left: 1px solid black;
            text-align: center;
            height: 50px;
            &.header {
              background-color: $primary;
              color: white;
              height: 35px;
            }
            &.row {
              width: 40px;
              img {
                width: 75px;
                height: 75px;
              }
            }
            &.product-name {
              width: calc(100% - 50px - 280px - 40px);
            }
            &.quantity {
              width: 50px;
            }
            &.price {
              width: 140px;
              overflow: hidden;
              max-width: 140px;
            }
            .td-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              p {
                padding: 10px;
                text-align: start;
                width: calc(100% - 20px);
                // background-color: red;
              }
            }
          }
          .table-row:last-child {
            border: none;
          }
        }
        .table-row-wrapper:nth-child(2n + 1) {
          background-color: $gray-bg;
        }
      }
      .total-count-row {
        height: 35px;
        display: flex;
        margin-top: 2px;
        gap: 2px;
        padding: 0 2px;
        .total-count-row-title {
          &.quantity-sum {
            background-color: $primary;
            color: white;
            width: calc(100% - 140px - 2px);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &.quantity-sum-value {
            width: 140px;
            background-color: $gray-bg;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
