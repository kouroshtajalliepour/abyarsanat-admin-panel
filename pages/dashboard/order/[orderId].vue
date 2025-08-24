<script lang="ts" setup>
import { storeToRefs } from "pinia";
import jmoment from "jalali-moment";
import { useAdminAuthStore } from "@/store/admin/auth";
import { useAdminStore } from "@/store/admin/index";
const adminAuth = useAdminAuthStore() as any;
const adminStore = useAdminStore() as any;
const token = adminAuth.authToken;

const { data, getLoading } = storeToRefs(adminStore) as any;

const { t, locale } = useI18n();

const route = useRoute();
useHead({
  title: "Admin | Single Order Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const {
  makeValidateString,
  validateNumber,
  validateIranianPhoneNumber,
  validateDescription,
} = useValidators() as any;

const localePath = useLocalePath();

const validateString = makeValidateString();

onMounted(async () => {
  try {
    await adminStore.getData({
      token: adminAuth.token,
      url: `/admin/manage/user/order/${route.params.orderId}`,
      query: "",
      lang: locale.value,
      dataResult: "",
    });
  } catch (err: any) {
    console.log(err);
  }
});

const links = ref([
  {
    name: t("links.topLinks.orderManagement"),
    path: "/dashboard/order",
  },
]);
watch(
  () => data.value,
  async () => {
    if (data.value) {
      links.value.push({
        name: t(`links.topLinks.orderStatusPage`, {
          order: t(`entities.values.status.${data.value.status}`),
        }),
        path: `/dashboard/order/status/${data.value.status}`,
      });

      links.value.push({
        name: data.value.payment_id,
        path: `/dashboard/order/${route.params.orderId}`,
      });
    }
  }
);

const statusActions = ref({
  edit: {
    title: t("buttons.updateQuote"),
    apiBaseUrl: "/admin/manage/user/order/",
    identifier: "id",
    fieldsToUpload: [],
    inputs: [
      {
        type: "select",
        label: t("entities.fields.status"),
        name: "status",
        value: "created_at desc",
        required: false,
        error: "",
        options: {
          nameKey: "name",
          valueKey: "value",
          options: [
            {
              name: t("entities.values.status.in-process"),
              value: "in-process",
            },
            {
              name: t("entities.values.status.packed"),
              value: "packed",
            },
            {
              name: t("entities.values.status.completed"),
              value: "completed",
            },
            {
              name: t("entities.values.status.canceled"),
              value: "canceled",
            },
          ],
        },
      },
      {
        type: "text",
        label: t("entities.fields.shipment_id"),
        name: "shipment_id",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.shipment_cost"),
        name: "shipment_cost",
        value: "",
        required: false,
        error: "",
        validator: validateNumber,
      },
      {
        type: "text",
        label: t("entities.fields.cart_number"),
        name: "cart_number",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
    ],
  },
});
const descriptionActions = ref({
  edit: {
    title: t("buttons.updateQuote"),
    apiBaseUrl: "/admin/manage/user/order",
    identifier: "id",
    fieldsToUpload: [],
    inputs: [
      {
        type: "text",
        label: t("entities.fields.recipient_first_name"),
        name: "recipient_first_name",
        value: "",
        required: true,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.recipient_last_name"),
        name: "recipient_last_name",
        value: "",
        required: true,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.recipient_phone_number"),
        name: "recipient_phone_number",
        value: "",
        required: true,
        error: "",
        validator: validateIranianPhoneNumber,
      },
      {
        type: "text",
        label: t("entities.fields.postal_code"),
        name: "postal_code",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.province_name"),
        name: "province_name",
        value: "",
        required: true,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.city_name"),
        name: "city_name",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.building_number"),
        name: "building_number",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
      {
        type: "text",
        label: t("entities.fields.building_unit"),
        name: "building_unit",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
      {
        type: "textarea",
        label: t("entities.fields.full_address"),
        name: "full_address",
        value: "",
        required: true,
        error: "",
        validator: validateDescription,
      },
      {
        type: "textarea",
        label: t("entities.fields.description"),
        name: "description",
        value: "",
        required: false,
        error: "",
        validator: validateString,
      },
    ],
  },
});
</script>
<template>
  <div>
    <AdminPagesTopLinks :links="links" />

    <div v-if="getLoading">
      {{ t("forms.general.loading.title") }}
    </div>

    <div v-else>
      <!-- <div class="page-buttons">
        <AdminModulesManageButton
          :title="`${t(`entities.fields.status`)} : ${t(
            `entities.values.status.${data.status}`
          )}`"
          :description="t('pages.orderManagement.statusDescription')"
          :actions="statusActions"
          :record="data"
        />
      </div> -->
      <!-- <h3 class="content-selector-title">{{ t("pages.orderManagement.titles.paymentInfo") }}</h3> -->
      <div class="order-info">
        <section class="order-basic">
          <div class="content-selector-title-for-boxes">
            <h3>
              {{ t("pages.orderManagement.titles.paymentInfo") }}
            </h3>
            <AdminModulesManageIcon
              :title="`${t(`entities.fields.status`)} : ${t(
                `entities.values.status.${data.status}`
              )}`"
              :description="t('pages.orderManagement.statusDescription')"
              :actions="statusActions"
              :record="data"
            />
          </div>
          <div class="order-wrapper">
            <p>
              <strong>
                {{
                  `${t(`entities.fields.status`)} : ${t(
                    `entities.values.status.${data.status}`
                  )}`
                }}
              </strong>
            </p>
            <p>
              <strong>{{ t("entities.fields.shipment_id") }}: </strong>

              <span v-if="data.shipment_id">
                {{ data.shipment_id }}
              </span>
              <span v-else> {{ t("entities.values.unavailable") }}</span>
            </p>
            <p>
              <strong>{{ t("entities.fields.shipment_method") }}: </strong>
              {{
                t(`entities.values.shipmentMethods.${data.shipment_method || "NA"}.title`)
              }}
            </p>
            <p v-if="data.payed_shipment_cost">
              <strong>{{ t("entities.fields.payed_shipment_cost") }}: </strong>
              {{ data.payed_shipment_cost }}
            </p>
            <p v-if="data.shipment_cost">
              <strong>{{ t("entities.fields.shipment_cost") }}: </strong>
              {{ data.shipment_cost }}
            </p>
            <p v-if="data.cart_number">
              <strong>{{ t("entities.fields.cart_number") }}: </strong>
              {{ data.cart_number }}
            </p>

            <div class="flex-items">
              <p>
                <strong>{{ t("entities.fields.payment_id") }}: </strong>
                {{ data.payment_id }}
              </p>
              <p>
                <strong>{{ t("entities.fields.ref_id") }}: </strong> {{ data.ref_id }}
              </p>
              <p>
                <strong>{{ t("entities.fields.total_weight") }}: </strong>
                {{ data.total_weight }}
              </p>
              <p v-if="data.provider !== 'none'">
                <strong>{{ t("entities.fields.merchant_id") }}: </strong>
                {{ data.merchant_id }}
              </p>
              <p v-if="data.provider !== 'none'">
                <strong>{{ t("entities.fields.authority_id") }}: </strong>
                {{ data.authority_id }}
              </p>
            </div>
            <p>
              <strong>{{ t("entities.fields.created_at") }}: </strong>
              {{ jmoment(data.created_at).locale(locale).calendar() }}
            </p>
            <p v-if="data.last_modified_at">
              <strong>{{ t("entities.fields.last_modified_at") }}: </strong>
              {{ jmoment(data.last_modified_at).locale(locale).calendar() }}
            </p>
          </div>
        </section>
        <section class="order-recipient">
          <div class="content-selector-title-for-boxes">
            <h3>
              {{ t("pages.orderManagement.titles.recipientInfo") }}
            </h3>
            <AdminModulesManageIcon
              :title="t('entities.fields.description')"
              :description="t('pages.orderManagement.descriptionDescription')"
              :actions="descriptionActions"
              :record="data"
            />
          </div>

          <div class="order-wrapper">
            <p @click="navigateTo(localePath(`/dashboard/user/${data.user_id}`))">
              <strong>{{ t("entities.fields.user") }} :</strong>
              <span class="material-icon round i-xs image-previe-button">
                open_in_new
              </span>
            </p>

            <div class="flex-items">
              <p>
                <strong>{{ t("entities.fields.first_name") }} :</strong>
                {{ data.recipient_first_name }}
              </p>
              <p>
                <strong>{{ t("entities.fields.last_name") }} :</strong>
                {{ data.recipient_last_name }}
              </p>
              <p>
                <strong>{{ t("entities.fields.phone_number") }} :</strong>
                <a :href="`tel:${data.recipient_phone_number}`" class="inline-ltr">
                  {{ data.recipient_phone_number }}
                </a>
              </p>
              <p>
                <strong>{{ t("entities.fields.province_name") }} :</strong>
                {{ data.province_name }}
              </p>
              <p>
                <strong>{{ t("entities.fields.city_name") }} :</strong>
                {{ data.city_name }}
              </p>
              <p>
                <strong>{{ t("entities.fields.postal_code") }} :</strong>
                {{ data.postal_code }}
              </p>
              <p>
                <strong>{{ t("entities.fields.building_number") }} :</strong>
                {{ data.building_number }}
              </p>
              <p>
                <strong>{{ t("entities.fields.building_unit") }} :</strong>
                {{ data.building_unit }}
              </p>
            </div>
            <p>
              <strong>{{ t("entities.fields.full_address") }} :</strong>
              {{ data.full_address }}
            </p>
            <p>
              <strong>{{ t("entities.fields.description") }} :</strong>
              {{ data.description }}
            </p>
          </div>
        </section>
      </div>

      <h3 class="content-selector-title">
        {{ t("pages.orderManagement.titles.cartItems") }}
      </h3>
      <client-only>
        <table>
          <thead>
            <th>
              {{ t("entities.fields.name") }}
            </th>
            <th>
              {{ t("entities.fields.image_url") }}
            </th>
            <th>
              {{ t("entities.fields.quantity") }}
            </th>
            <th>
              {{ t("entities.fields.weight") }}
            </th>
            <th>
              {{ t("entities.fields.price") }}
            </th>
            <th>
              {{ t("entities.fields.discounted_price") }}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="product in data.cart_items"
              @click="
                navigateTo(
                  localePath(
                    `/dashboard/product/product/${product.id}/model/${product.selectedModel.id}`
                  )
                )
              "
            >
              <td>
                <span>{{ product.name }} ({{ product.selectedModel.name }})</span>
              </td>
              <td>
                <img
                  :src="
                    product.selectedModel?.image_url
                      ? product.selectedModel.image_url
                      : product.image_url
                  "
                  width="100px"
                  height="100px"
                />
                <!-- image :
                {{
                  product.selectedModel?.image_url
                    ? product.selectedModel.image_url
                    : product.image_url
                }} -->
              </td>
              <td>
                <span>{{ product.quantity }}</span>
              </td>
              <td>
                <span>{{ product.weight }}</span>
              </td>
              <td>
                <span>{{
                  product.selectedModel.price_is_dynamic ? 0 : product.selectedModel.price
                }}</span>
              </td>
              <td>
                <span>{{
                  product.selectedModel.price_is_dynamic
                    ? 0
                    : product.selectedModel.discounted_price
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </client-only>
      <client-only>
        <div class="half-width-wrapper">
          <table class="half-width">
            <tbody>
              <tr>
                <td>
                  <span>{{ t("entities.fields.total_amount") }}</span>
                </td>
                <td>
                  <span>{{ !data.total_amount ? 0 : data.total_amount }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.total_discounted_amount") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.total_discounted_amount ? 0 : data.total_discounted_amount
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.promotion_slug") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.promotion_discount_price ? "------" : data.promotion_slug
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.promotion_discount_price") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.promotion_discount_price ? 0 : data.promotion_discount_price
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.promotion_discount_percentage") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.promotion_discount_percentage
                      ? 0
                      : data.promotion_discount_percentage
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.total_promoted_amount") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.total_promoted_amount ? 0 : data.total_promoted_amount
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.payed_shipment_cost") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.payed_shipment_cost ? 0 : data.payed_shipment_cost
                  }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>{{ t("entities.fields.total_payed_amount") }}</span>
                </td>
                <td>
                  <span>{{
                    !data.total_payed_amount ? 0 : data.total_payed_amount
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </client-only>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/admin/global.scss";
@import "@/assets/scss/admin/helpers/_variables.scss";
.half-width-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 30px 0 !important;
}
.content-selector-title {
  margin: 30px 0 !important;
}
.half-width {
  max-width: 455px !important;
}
.order-info {
  display: flex;
  flex-wrap: wrap;
  margin: 20px 0 !important;
  gap: 20px;
  .inline-ltr {
    direction: ltr !important;
  }
  .order-basic,
  .order-recipient {
    flex: 1 1 200px;
    border-radius: 6px;
    border: 1px solid #eee;
    .order-wrapper {
      padding: 20px;
    }
    .content-selector-title-for-boxes {
      background-color: whitesmoke;
      display: flex;
      justify-content: space-between;
      padding: 15px;
      h3 {
        font-size: 1.2em;
      }
      button {
        background-color: whitesmoke;
      }
    }
    p {
      font-size: 1.05em;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }
    .flex-items {
      display: flex;
      flex-wrap: wrap;
      p {
        min-width: calc(50% - 20px);
      }
    }
  }
}
</style>
