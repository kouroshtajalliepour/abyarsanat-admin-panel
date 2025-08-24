<script lang="ts" setup>
import jmoment from "jalali-moment";
import { useAdminStore } from "@/store/admin/index";
const adminStore = useAdminStore() as any;
import { storeToRefs } from "pinia";
import { reactive, ref,watch } from "vue";

const { multiData } = storeToRefs(adminStore);
// * validation

useHead({
  title: "Admin | Admin Role Management",
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t, locale } = useI18n();

const route = useRoute();

const {
    public: {
        accessGroups
    }
}= useRuntimeConfig()


watch(
  () => multiData.value,
  () => {
    let options: any

    if (multiData.value && multiData.value.length) {
        const mappedData = multiData.value.map((data:any) => {
            return data.access_group
        })

        console.log(accessGroups, mappedData)

        
        
        options = accessGroups.map((ag:string) => {
            
            if (!mappedData.includes(ag)) {
                return {
                    key: t(`entities.values.accessGroup.${ag}`),
                    value: ag
                }
            }
        }).filter((ag:any) => {
            if (ag){
                return ag
            }
        })
    }else {
        options = accessGroups.map((ag:string) => {
            
            return {
                key: t(`entities.values.accessGroup.${ag}`),
                value: ag
            }
        })
    }

    adminRoleAccessCreate.value = {
        title: t("pages.adminRoleAccessManagement.createQuote"),
        dataResult: "",
        fieldsToUpload: [],
        preDefined: {
            role_id: route.params.adminRoleId
        },
        inputs: [
            {
                type: "select",
                label: t("entities.fields.access_group"),
                name: "access_group",
                value: "",
                error: "",
                options: {
                    nameKey: "key",
                    valueKey: "value",
                    options,
                },
            },
        ],
    }
    //   emit("update:modelValue", date)
  }
);


const adminRoleAccessCreate = ref({
  title: t("pages.adminRoleAccessManagement.createQuote"),
  dataResult: "",
  fieldsToUpload: [],
  preDefined: {
    role_id: route.params.adminRoleId
  },
  inputs: [
    {
        type: "select",
        label: t("entities.fields.access_group"),
        name: "access_group",
        value: "",
        error: "",
        options: {
            nameKey: "key",
            valueKey: "value",
            options: [],
        },
    },
  ],
});
const adminRoleAccessGet = ref({
  identifier: "id",
  dataResult: "result",
  dataCountResult: "totalCount",
  singleRecordUrl: `/dashboard/admin/role/`,
  preDefined: {},
  visibleFields: [
    {
      value: t("entities.fields.access_group"),
      key: "access_group",
      _constructor: (value: any) => {
        return t(`entities.values.accessGroup.${value}`)
      },
    },
    {
      value: t("entities.fields.created_at"),
      key: "created_at",
      _constructor: (value: any) => {
        try {
          return jmoment(value).locale(locale.value).calendar();
        } catch (error) {
          console.log("🚀 ~ file: index.vue:285 ~ error", error);
        }
      },
    },
  ],
});
const localePath = useLocalePath();
const links = ref([
  {
    name: t("links.topLinks.admins"),
    path: "/dashboard/admin",
  },
  {
    name: t("links.topLinks.adminRoles"),
    path: "/dashboard/admin/role",
  },
  {
    name: t("links.topLinks.adminSingleRole"),
    path: `/dashboard/admin/role/${route.params.adminRoleId}`,
  },
  {
    name: t("links.topLinks.adminRoleAccess"),
    path: `/dashboard/admin/role/${route.params.adminRoleId}/access`,
  },
]);
const accessLevelDelete = ref({
    title: t("buttons.delete.heading"),
  apiBaseUrl: "/admin/manage/admin/admin-role-access/",
  identifier: "id",
})
</script>

<template>
  <div>
    <AdminPagesTopLinks :links="links" />
    <AdminPagesMultiRecordPageTemplate
      :get="adminRoleAccessGet"
      tableName="admin_role_access"
      :create="adminRoleAccessCreate"
      apiBaseUrl="/admin/manage/admin/admin-role-access"
      :baseUrl="`/dashboard/admin/role/${route.params.adminRoleId}`"
      :singlePageIncluded="false"
      :Delete="accessLevelDelete"
      :pagination="false"
      :useCSRFToken="true"
      :pageSize="30"
    />
  </div>
</template>

<style></style>
