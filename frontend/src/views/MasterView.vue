<script setup>
import { computed } from 'vue';
import CrudPage from '../components/CrudPage.vue';
import { pages } from '../config/fields';

const props = defineProps({ page: { type: String, required: true } });

const config = computed(() => pages[props.page]);
</script>

<template>
  <CrudPage :key="page" v-bind="config" />
</template>
