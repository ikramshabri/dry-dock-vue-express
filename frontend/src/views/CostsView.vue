<script setup>
import { computed, inject, onMounted, ref } from 'vue';
import CostSummary from '../components/CostSummary.vue';
import StatusBadge from '../components/StatusBadge.vue';
import { dryDockService, workOrderService } from '../services';
import { downloadCsv } from '../utils/csv';

const props = defineProps({ id: { type: String, required: true } });

const dock = inject('dock');
const summary = ref(null);
const orders = ref([]);
const search = ref('');
const error = ref('');

const columns = [
  ['title', 'Job Name'],
  ['status', 'Status'],
  ['budget', 'Total Budget'],
  ['yard_estimate', 'Yard Estimates'],
  ['owner_estimate', 'Owner Estimate'],
  ['total_estimates', 'Total Estimates'],
  ['actual_yard_cost', 'Actual Yard Costs'],
  ['actual_owner_cost', 'Actual Owner Costs'],
  ['total_costs', 'Total Costs'],
];

const rows = computed(() =>
  orders.value
    .map((o) => ({
      ...o,
      total_estimates: Number(o.yard_estimate) + Number(o.owner_estimate),
      total_costs: Number(o.actual_yard_cost) + Number(o.actual_owner_cost),
    }))
    .filter((o) => o.title.toLowerCase().includes(search.value.toLowerCase()))
);

const isMoney = (key) => !['title', 'status'].includes(key);
const money = (value) => `${Number(value ?? 0).toLocaleString('en-US')}$`;

async function load() {
  try {
    summary.value = await dryDockService.summary(props.id);
    orders.value = await workOrderService.list({ dry_dock_id: props.id });
  } catch (e) {
    error.value = e.message;
  }
}

async function copyEstimates() {
  if (!confirm('Salin Yard Estimates ke Actual Yard Costs untuk semua pekerjaan?')) return;
  try {
    await dryDockService.copyEstimates(props.id);
    await load();
  } catch (e) {
    error.value = e.message;
  }
}

function exportCsv() {
  const filename = `costs-${dock.value.dry_dock_no.replace(/\//g, '-')}.csv`;
  downloadCsv(filename, columns.map(([key, label]) => ({ key, label })), rows.value);
}

onMounted(load);
</script>

<template>
  <div class="banner slim"><h1>Costs</h1></div>
  <p v-if="error" class="error">{{ error }}</p>

  <template v-if="summary">
    <h2>Summary</h2>
    <CostSummary :summary="summary" :currency="dock.currency ?? ''" />
  </template>

  <div class="card">
    <div class="row">
      <h2>Details</h2>
      <div class="actions">
        <input v-model="search" placeholder="Search" />
        <button @click="copyEstimates">Copy Yard Estimates to Actual</button>
        <button class="secondary" @click="exportCsv">EXPORT</button>
      </div>
    </div>

    <div class="scroll-x">
      <table>
        <thead>
          <tr><th></th><th v-for="[key, label] in columns" :key="key">{{ label }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="row.id">
            <td class="num">{{ index + 1 }}</td>
            <td v-for="[key] in columns" :key="key">
              <StatusBadge v-if="key === 'status'" :status="row.status" />
              <template v-else-if="isMoney(key)">{{ money(row[key]) }}</template>
              <template v-else>{{ row[key] }}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
