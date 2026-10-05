<script setup>
import { computed, inject, onMounted, ref, watch } from 'vue';
import CrudPage from '../components/CrudPage.vue';
import CostSummary from '../components/CostSummary.vue';
import DonutChart from '../components/DonutChart.vue';
import BarChart from '../components/BarChart.vue';
import {
  dryDockService, shipyardService, workOrderService, attachmentService, purchaseOrderService,
} from '../services';
import { workOrderFields, attachmentFields, purchaseOrderFields } from '../config/fields';
import { workOrderRow, attachmentRow } from '../config/rows';
import { formatDate } from '../utils/format';

const props = defineProps({ id: { type: String, required: true } });

const dock = inject('dock');
const reloadDock = inject('reloadDock');

const summary = ref(null);
const shipyards = ref([]);
const shipyardId = ref('');
const error = ref('');

const statusColors = {
  open: '#0a95f5',
  in_progress: '#62a346',
  on_hold: '#e8669d',
  complete: '#00a0c8',
};

watch(dock, (value) => (shipyardId.value = value?.shipyard_id ?? ''), { immediate: true });

async function reloadSummary() {
  summary.value = await dryDockService.summary(props.id);
}

async function refresh() {
  try {
    await reloadDock();
    await reloadSummary();
  } catch (e) {
    error.value = e.message;
  }
}

async function patch(data) {
  error.value = '';
  try {
    await dryDockService.patch(props.id, data);
    await refresh();
  } catch (e) {
    error.value = e.message;
  }
}

async function startDryDock() {
  error.value = '';
  try {
    await dryDockService.start(props.id);
    await refresh();
  } catch (e) {
    error.value = e.message;
  }
}

const info = computed(() => [
  ['Dry Dock No', dock.value.dry_dock_no],
  ['Description', dock.value.description],
  ['Company', dock.value.company],
  ['Account Code', dock.value.account_code],
  ['Responsible Rank', dock.value.responsible_rank],
  ['Budget', `${Number(dock.value.budget ?? 0).toLocaleString('en-US')}${dock.value.currency === 'USD' ? '$' : ` ${dock.value.currency ?? ''}`}`],
  ['Currency', dock.value.currency],
]);

const dates = computed(() => [
  ['Planned Start Date', formatDate(dock.value.planned_start)],
  ['Planned End Date', formatDate(dock.value.planned_end)],
  ['Actual Start Date', formatDate(dock.value.actual_start)],
  ['Actual End Date', formatDate(dock.value.actual_end)],
]);

const statusSlices = computed(() =>
  Object.entries(statusColors).map(([status, color]) => ({
    label: status.replace('_', ' '),
    value: summary.value?.statuses.find((s) => s.status === status)?.total ?? 0,
    color,
  }))
);

const days = (from, to) =>
  from && to ? Math.max(0, Math.round((new Date(to) - new Date(from)) / 86400000)) : 0;

// lama yard stay dihitung dari tanggal rencana dan tanggal aktual
const staySlices = computed(() => [
  { label: 'Planned Days', value: days(dock.value.planned_start, dock.value.planned_end), color: '#0a95f5' },
  { label: 'Actual Days', value: days(dock.value.actual_start, dock.value.actual_end), color: '#62a346' },
]);

const barSeries = [
  { name: 'Total Costs', color: '#0a95f5' },
  { name: 'Total Estimates', color: '#62a346' },
  { name: 'Total Budget', color: '#e8669d' },
];

const barGroups = computed(() =>
  (summary.value?.groups ?? []).map((g) => ({
    label: g.name,
    values: [g.total_costs, g.total_estimates, g.total_budget],
  }))
);

onMounted(async () => {
  shipyards.value = await shipyardService.list();
  try {
    await reloadSummary();
  } catch (e) {
    error.value = e.message;
  }
});
</script>

<template>
  <div class="banner">
    <div class="banner-left">
      <img v-if="dock.vessel_image" :src="dock.vessel_image" class="ship" alt="" />
      <div v-else class="ship"></div>
      <div>
        <small>{{ dock.vessel_name }}</small>
        <h1>{{ dock.dry_dock_no }}</h1>
        <div>{{ dock.description }}</div>
      </div>
    </div>
    <button class="light" :disabled="dock.status !== 'planning'" @click="startDryDock">
      Start Dry Dock
    </button>
  </div>
  <p v-if="error" class="error">{{ error }}</p>

  <section id="general">
    <div class="info">
      <div v-for="[label, value] in info" :key="label">
        <small>{{ label }}</small>
        <div>{{ value || '-' }}</div>
      </div>
    </div>
    <div class="info dates">
      <div v-for="[label, value] in dates" :key="label">
        <small>{{ label }}</small>
        <div>{{ value }}</div>
      </div>
    </div>

    <div class="card shipyard">
      <div>
        <label>
          Shipyard
          <select v-model="shipyardId">
            <option value="">-</option>
            <option v-for="y in shipyards" :key="y.id" :value="y.id">{{ y.name }}</option>
          </select>
        </label>
        <button class="spaced" @click="patch({ shipyard_id: shipyardId })">SELECT SHIPYARD</button>
      </div>
      <p class="hint">
        {{ dock.shipyard_name ? `Shipyard: ${dock.shipyard_name}` : 'No Shipyard Selected' }}
      </p>
    </div>

    <div class="card row">
      <label class="narrow">
        Priority
        <select :value="dock.priority" @change="patch({ priority: $event.target.value })">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <div>
        <small>Status</small>
        <div class="pills">
          <button
            v-for="s in ['planning', 'execution', 'completed']"
            :key="s"
            class="pill"
            :class="{ active: dock.status === s }"
            @click="patch({ status: s })"
          >
            {{ s }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <section v-if="summary">
    <h2>Cost Summary</h2>
    <CostSummary :summary="summary" :currency="dock.currency === 'USD' ? '$' : dock.currency ?? ''" :columns="5" />

    <div class="charts">
      <div class="card">
        <h2>Status</h2>
        <DonutChart :slices="statusSlices" />
      </div>
      <div class="card">
        <h2>Yard Stay</h2>
        <DonutChart :slices="staySlices" />
      </div>
    </div>
    <div class="card">
      <h2>Comparison</h2>
      <BarChart :groups="barGroups" :series="barSeries" />
    </div>
  </section>

  <section id="specifications">
    <CrudPage
      title="Specifications"
      heading-tag="h2"
      item-name="Work Order"
      add-label="Add Work Order"
      :service="workOrderService"
      :fields="workOrderFields"
      :fixed="{ dry_dock_id: id }"
      layout="list"
      :row="workOrderRow"
      group-by="spec_group_id"
      @changed="reloadSummary"
    />

    <CrudPage
      title="Attachments"
      heading-tag="h2"
      item-name="Attachment"
      :service="attachmentService"
      :fields="attachmentFields"
      :fixed="{ dry_dock_id: id }"
      layout="list"
      :row="attachmentRow"
    />
  </section>

  <section>
    <CrudPage
      title="Purchase Orders"
      heading-tag="h2"
      item-name="Purchase Order"
      :service="purchaseOrderService"
      :fields="purchaseOrderFields"
      :fixed="{ dry_dock_id: id }"
      group-by="category"
    />
  </section>

  <div class="backbar">
    <router-link to="/dry-docks"><button>Back</button></router-link>
  </div>
</template>
