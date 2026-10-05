<script setup>
import { computed } from 'vue';

const props = defineProps({ slices: { type: Array, required: true } });

const total = computed(() => props.slices.reduce((sum, s) => sum + s.value, 0));

// lingkaran dengan keliling 100 supaya nilai persen bisa langsung dipakai
const arcs = computed(() => {
  let offset = 25;
  return props.slices.map((slice) => {
    const percent = total.value ? (slice.value / total.value) * 100 : 0;
    const arc = { ...slice, dash: `${percent} ${100 - percent}`, offset };
    offset -= percent;
    return arc;
  });
});
</script>

<template>
  <div class="donut-wrap">
    <svg viewBox="-2 -2 40 40" class="donut">
      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#eee" stroke-width="5" />
      <circle
        v-for="arc in arcs"
        :key="arc.label"
        cx="18"
        cy="18"
        r="15.9155"
        fill="none"
        :stroke="arc.color"
        stroke-width="5"
        :stroke-dasharray="arc.dash"
        :stroke-dashoffset="arc.offset"
      />
    </svg>
    <ul class="legend">
      <li v-for="slice in slices" :key="slice.label">
        <i :style="{ background: slice.color }"></i>{{ slice.label }} {{ slice.value }}
      </li>
    </ul>
  </div>
</template>
