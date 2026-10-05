<script setup>
import CrudPage from '../components/CrudPage.vue';
import { purchaseOrderService } from '../services';
import { purchaseOrderFields } from '../config/fields';

defineProps({ id: { type: String, required: true } });
</script>

<template>
  <CrudPage
    title="Purchase Orders"
    item-name="Purchase Order"
    :service="purchaseOrderService"
    :fields="purchaseOrderFields"
    :fixed="{ dry_dock_id: id }"
    group-by="category"
  />
</template>
