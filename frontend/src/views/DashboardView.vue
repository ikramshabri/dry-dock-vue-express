<script setup>
import { computed, onMounted, ref } from 'vue';
import { dryDockService } from '../services';
import DonutChart from '../components/DonutChart.vue';

const docks = ref([]);

onMounted(async () => {
  docks.value = await dryDockService.list();
});

const countByStatus = (status) => docks.value.filter((d) => d.status === status).length;

const slices = computed(() => [
  { label: 'Planning', value: countByStatus('planning'), color: '#0a95f5' },
  { label: 'Execution', value: countByStatus('execution'), color: '#62a346' },
  { label: 'Completed', value: countByStatus('completed'), color: '#e8669d' },
]);

const totalBudget = computed(() =>
  docks.value.reduce((sum, d) => sum + Number(d.budget || 0), 0)
);
</script>

<template>
  <h1>Dashboard</h1>
  <div class="stats">
    <div class="card stat">
      <small>Total Dry Docks</small>
      <strong>{{ docks.length }}</strong>
    </div>
    <div class="card stat">
      <small>Total Budget</small>
      <strong>{{ totalBudget.toLocaleString('en-US') }}</strong>
    </div>
  </div>
  <div class="card">
    <h2>Dry Dock Status</h2>
    <DonutChart :slices="slices" />
  </div>
</template>
