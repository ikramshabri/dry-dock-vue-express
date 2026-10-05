<script setup>
import { computed, ref } from 'vue';
import CrudPage from '../components/CrudPage.vue';
import SubTabs from '../components/SubTabs.vue';
import SpecUpdates from '../components/SpecUpdates.vue';
import { executionRecordService } from '../services';
import { executionRecordFields } from '../config/fields';

defineProps({ id: { type: String, required: true } });

const tabs = [
  { id: 'updates', label: 'Updates' },
  { id: 'fact', label: 'Dry Dock Facts' },
  { id: 'meeting', label: 'Meetings' },
  { id: 'variation_order', label: 'Variation Orders' },
];
const tab = ref('updates');
const label = computed(() => tabs.find((t) => t.id === tab.value).label);
</script>

<template>
  <SubTabs v-model="tab" :tabs="tabs" />

  <SpecUpdates v-if="tab === 'updates'" :dry-dock-id="id" />
  <CrudPage
    v-else
    :key="tab"
    :title="label"
    :item-name="label"
    :service="executionRecordService"
    :fields="executionRecordFields"
    :fixed="{ dry_dock_id: id, type: tab }"
  />
</template>
