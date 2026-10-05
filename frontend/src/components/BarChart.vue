<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  groups: { type: Array, required: true },
  series: { type: Array, required: true },
});

const hovered = ref(null);

function niceStep(value) {
  const power = 10 ** Math.floor(Math.log10(value));
  const n = value / power;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * power;
}

const maxValue = computed(
  () => Math.max(0, ...props.groups.flatMap((g) => g.values)) || 100,
);
const step = computed(() => niceStep(maxValue.value / 6));
const top = computed(() => Math.ceil(maxValue.value / step.value) * step.value);

const ticks = computed(() =>
  Array.from({ length: Math.round(top.value / step.value) + 1 }, (_, i) =>
    Number((i * step.value).toFixed(6)),
  ),
);
const labelTicks = computed(() => ticks.value.filter((tick) => tick > 0));

const percent = (value) => `${(value / top.value) * 100}%`;
</script>

<template>
  <div>
    <ul class="legend legend-left">
      <li v-for="s in series" :key="s.name">
        <i :style="{ background: s.color }"></i>{{ s.name }}
      </li>
    </ul>

    <p v-if="!groups.length" class="empty">Belum ada data.</p>

    <div v-else class="chart">
      <div class="y-axis">
        <span
          v-for="tick in labelTicks"
          :key="tick"
          :style="{ bottom: percent(tick) }"
          >{{ tick }}</span
        >
      </div>

      <div class="plot">
        <div class="grid">
          <i
            v-for="tick in ticks"
            :key="tick"
            :style="{ bottom: percent(tick) }"
          ></i>
        </div>

        <div class="cols">
          <div
            v-for="(group, index) in groups"
            :key="group.label"
            class="col"
            :class="{ hovered: hovered === index }"
            @mouseenter="hovered = index"
            @mouseleave="hovered = null"
          >
            <div class="bar-area">
              <div
                v-for="(value, i) in group.values"
                :key="i"
                class="bar"
                :style="{ height: percent(value), background: series[i].color }"
              ></div>
            </div>
            <small class="x-label">{{ group.label }}</small>

            <div
              v-if="hovered === index"
              class="tooltip"
              :class="{ flip: index >= groups.length / 2 }"
            >
              <strong>{{ group.label }}</strong>
              <div v-for="(value, i) in group.values" :key="i" class="tip-row">
                <i :style="{ background: series[i].color }"></i
                >{{ series[i].name }}
                <b>{{ value.toFixed(2) }}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
