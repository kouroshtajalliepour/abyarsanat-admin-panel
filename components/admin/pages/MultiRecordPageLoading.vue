<script lang="ts" setup>
const props = defineProps<{
  pageSize: any;
  showFilterButton: any;
  showCreateButton: any;
  showLogsButton: any;
  showDownloadButton: any;
  showPaginationButton: any;
}>();
</script>

<template>
  <div class="loading">
    <!-- todo change styles -->
    <div class="user-management-page-wrapper active">
      <div class="control-buttons-wrapper loading-table">
        <button
          type="button"
          class="add-user-control-button filter"
          v-if="showFilterButton"
        >
          <div class="add-icon-wrapper"></div>
          <p class="add-message skeleton-loader"></p>
        </button>
        <slot></slot>
        <button v-if="showCreateButton" type="button" class="add-user-control-button">
          <div class="add-icon-wrapper"></div>
          <p class="add-message skeleton-loader"></p>
        </button>
        <button v-if="showLogsButton" type="button" class="add-user-control-button">
          <div class="add-icon-wrapper"></div>
          <p class="add-message skeleton-loader"></p>
        </button>
        <button v-if="showDownloadButton" type="button" class="add-user-control-button">
          <div class="add-icon-wrapper"></div>
          <p class="add-message skeleton-loader"></p>
        </button>
      </div>
    </div>
    <client-only v-if="pageSize">
      <p class="total-count-loading"></p>
      <table class="loading-table">
        <thead class="yo">
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
          <th class="yo">
            <p class="skeleton-loader"></p>
          </th>
        </thead>
        <tbody>
          <tr v-for="i in 5">
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
            <th class="yo">
              <p class="skeleton-loader"></p>
            </th>
          </tr>
        </tbody>
      </table>
    </client-only>
    <div v-if="showPaginationButton">
      <button type="button" class="infinite-scroll-button disabled loading-button skeleton-loader" disabled>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.loading {
  .skeleton-loader {
  // height: 15px;
  // display: block;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    lightgray;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
}
.loading-button{
  width: 110px;
}
  .add-icon-wrapper {
    width: 54px;
    height: 54px;
  }
  .add-message {
    width: 100%;
    height: 13px;
  }
  .total-count-loading {
    width: 50%;
    height: 13.4px;
  }
  .loading-table {
    overflow: hidden !important;
  }
  .yo {
    width: 100%;
    p{
      width: 70px;
      height: 21.6px;
    }
  }
}
</style>
