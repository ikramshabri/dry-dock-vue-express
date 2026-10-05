<script setup>
import CrudPage from '../components/CrudPage.vue';
import { taskService } from '../services';
import { taskFields } from '../config/fields';
import { taskRow } from '../config/rows';

defineProps({ id: { type: String, required: true } });
</script>

<template>
  <CrudPage
    title="Tasks"
    item-name="Task"
    :service="taskService"
    :fields="taskFields"
    :fixed="{ dry_dock_id: id }"
    layout="list"
    :row="taskRow"
    group-by="status"
  />
</template>
