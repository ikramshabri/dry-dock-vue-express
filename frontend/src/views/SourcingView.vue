<script setup>
import CrudPage from '../components/CrudPage.vue';
import { rfqService, quotationDetailService } from '../services';
import { rfqFields, quotationDetailFields } from '../config/fields';

defineProps({ id: { type: String, required: true } });
</script>

<template>
  <CrudPage
    title="RFQ"
    item-name="RFQ"
    :service="rfqService"
    :fields="rfqFields"
    :fixed="{ dry_dock_id: id }"
    layout="details"
  />

  <CrudPage
    title="Quotation Details"
    item-name="Quotation Detail"
    heading-tag="h2"
    :service="quotationDetailService"
    :fields="quotationDetailFields"
    :fixed="{ dry_dock_id: id }"
    numbered
  />
</template>
