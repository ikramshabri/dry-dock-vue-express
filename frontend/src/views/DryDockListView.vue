<script setup>
import { computed, onMounted, ref } from "vue";
import CrudPage from "../components/CrudPage.vue";
import SubTabs from "../components/SubTabs.vue";
import { dryDockService } from "../services";
import {
  dryDockFields,
  dryDockMinimalColumns,
  dryDockDetailedColumns,
} from "../config/fields";
import { downloadCsv } from "../utils/csv";

const docks = ref([]);
const view = ref("minimal");
const sortOrder = ref("asc");

const tabs = [
  { id: "minimal", label: "Minimal" },
  { id: "detailed", label: "Detailed" },
];

const activeDocks = computed(() => {
  const direction = sortOrder.value === "asc" ? 1 : -1;
  return docks.value
    .filter((dock) => dock.status !== "completed")
    .sort((a, b) => (a.id - b.id) * direction);
});

const columns = computed(() =>
  view.value === "minimal" ? dryDockMinimalColumns : dryDockDetailedColumns,
);

const load = async () => {
  docks.value = await dryDockService.list();
};

const exportCsv = () =>
  downloadCsv("dry-docks.csv", dryDockDetailedColumns, docks.value);

onMounted(load);
</script>

<template>
  <div class="banner slim"><h1>Dry Docks</h1></div>

  <h2>My Dry Docks</h2>
  <div class="cards">
    <router-link
      v-for="dock in activeDocks"
      :key="dock.id"
      :to="`/dry-docks/${dock.id}`"
      class="dock-card"
    >
      <img
        v-if="dock.vessel_image"
        :src="dock.vessel_image"
        class="cover"
        alt=""
      />
      <div v-else class="cover"></div>
      <small class="label">{{ dock.vessel_name }}</small>
      <strong>{{ dock.status }}</strong>
      <span>{{ dock.dry_dock_no }}</span>
    </router-link>
  </div>

  <SubTabs v-model="view" :tabs="tabs" />

  <CrudPage
    :key="view"
    title="All Dry Docks"
    item-name="Dry Dock"
    :service="dryDockService"
    :fields="dryDockFields"
    :table-columns="columns"
    :row-to="(dock) => `/dry-docks/${dock.id}`"
    :hide-header="view === 'minimal'"
    :numbered="view === 'detailed'"
    :sort-order="sortOrder"
    filter-key="status"
    @changed="load"
  >
    <template #toolbar>
      <select v-model="sortOrder" class="search">
        <option value="desc">Data terakhir</option>
        <option value="asc">Data pertama</option>
      </select>
      <button class="light-outline" @click="exportCsv">Export</button>
    </template>
  </CrudPage>
</template>
