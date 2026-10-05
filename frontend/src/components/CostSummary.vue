<script setup>
import { computed } from 'vue';

const props = defineProps({
  summary: { type: Object, required: true },
  currency: { type: String, default: '' },
  columns: { type: Number, default: 4 },
});

const format = (value) => `${Number(value).toLocaleString('en-US')} ${props.currency}`;

const cards = computed(() => {
  const s = props.summary;
  return [
    ['Budget', format(s.budget)],
    ['Yard Estimates', format(s.yard_estimates)],
    ['Owner Estimates', format(s.owner_estimates)],
    ['Total Estimates', format(s.total_estimates)],
    ['Actual Yard Costs', format(s.actual_yard_costs)],
    ['Actual Owner Costs', format(s.actual_owner_costs)],
    ['Total Costs', format(s.total_costs)],
    ['Variance', `${format(Math.abs(s.variance))} ${s.variance >= 0 ? '\u2191' : '\u2193'}`],
  ];
});
</script>

<template>
  <div class="stats" :style="{ gridTemplateColumns: `repeat(${columns}, 1fr)` }">
    <div v-for="[label, value] in cards" :key="label" class="card stat">
      <small>{{ label }}</small>
      <strong>{{ value }}</strong>
    </div>
  </div>
</template>
