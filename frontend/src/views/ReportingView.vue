<script setup>
import { computed, ref } from 'vue';
import CrudPage from '../components/CrudPage.vue';
import SubTabs from '../components/SubTabs.vue';
import { reportService } from '../services';
import { reportFields } from '../config/fields';

defineProps({ id: { type: String, required: true } });

const tabs = [
  { id: 'daily', label: 'Daily Reports' },
  { id: 'completion', label: 'Completion Report' },
];
const type = ref('daily');
const label = computed(() => tabs.find((t) => t.id === type.value).label);
</script>

<template>
  <SubTabs v-model="type" :tabs="tabs" />
  <CrudPage
    :key="type"
    :title="label"
    item-name="Report"
    :service="reportService"
    :fields="reportFields"
    :fixed="{ dry_dock_id: id, type }"
  />
</template>
